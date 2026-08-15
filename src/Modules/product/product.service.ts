import { ProductRepositoryService } from './../../common/DP/productRepositoryService';
import { CloudService, IAttachments } from './../../common/Services/cloudService';
import { SubcategoryRepositoryService } from './../../common/DP/subcategoryRepositoryService';
import { BrandRepositoryService } from './../../common/DP/brandRepositoryService';
import { CategoryRepositoryService } from './../../common/DP/categoryRepositoryService';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RoleTypes, UserDocument } from 'src/Database/Models/user.model';
import { CreateProductDTO } from './productDtos/addProduct.dto';
import { v4 as uuid } from 'uuid';
import { updateProductDto } from './productDtos/updateAndDeleteProduct.dto';
import { Types } from 'mongoose';
import { ProductQueryDto } from './productDtos/product.query.dto';
import { IProduct } from './product.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
@Injectable()
export class ProductService {
    constructor(private readonly CategoryRepositoryService: CategoryRepositoryService,
        private readonly BrandRepositoryService: BrandRepositoryService,
        private readonly SubcategoryRepositoryService: SubcategoryRepositoryService,
        private readonly CloudService: CloudService,
        private readonly ProductRepositoryService: ProductRepositoryService
    ) { }
    async createProduct(user: UserDocument, body: CreateProductDTO, files: { image: Express.Multer.File[], gallery?: Express.Multer.File[] })
        : Promise<{ message: string, product: any }> {
        const category = await this.CategoryRepositoryService.findOne({ filter: { _id: body.categoryId } });
        const brand = await this.BrandRepositoryService.findOne({ filter: { _id: body.brandId } });
        const subcategory = await this.SubcategoryRepositoryService.findOne({ filter: { _id: body.subcategoryId } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }

        let folderId = uuid();

        let { secure_url, public_id } = await this.CloudService.uploadFile(files.image[0], {
            folderId: `${process.env.APP_NAME}/products/${folderId}`
        });
        let gallery: IAttachments[] = [];
        if (files.gallery && files.gallery.length > 0) {
            gallery = await this.CloudService.uploadFiles(files.gallery, {
                folderId: `${process.env.APP_NAME}/products/${folderId}/gallery`
            })
        }
        let finalPrice = this.calculateFinalPrice(body.originalPrice, body.discountPercent);

        let product = await this.ProductRepositoryService.create({
            ...body,
            image: { secure_url, public_id },
            gallery,
            finalPrice,
            createdBy: user._id,
            folderId
        })

        return { message: 'Product created successfully', product };
    }
    async updateProduct(user: UserDocument, body: updateProductDto, productId: Types.ObjectId, files?: { image?: Express.Multer.File[], gallery?: Express.Multer.File[] })
        : Promise<{ message: string }> {
        const existingProduct = await this.ProductRepositoryService.findOne({ filter: { _id: productId } });
        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }
        if (body.categoryId) {
            const category = await this.CategoryRepositoryService.findOne({ filter: { _id: body.categoryId } });
            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }
        if (body.subcategoryId) {
            const subcategory = await this.SubcategoryRepositoryService.findOne({ filter: { _id: body.subcategoryId } });
            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }
        }
        if (body.brandId) {
            const brand = await this.BrandRepositoryService.findOne({ filter: { _id: body.brandId } });
            if (!brand) {
                throw new NotFoundException('Brand not found');
            }
        }

        let folderId = uuid();
        let image: IAttachments = existingProduct.image;
        if (files?.image && files.image.length > 0) {

            image = await this.CloudService.uploadFile(files.image[0], {
                folderId: `${process.env.APP_NAME}/products/${folderId}`
            });
        }



        let gallery: IAttachments[] = existingProduct.gallery || [];
        if (files?.gallery && files.gallery.length > 0) {
            gallery = await this.CloudService.uploadFiles(files.gallery, {
                folderId: `${process.env.APP_NAME}/products/${folderId}/gallery`
            })
        }
        let finalPrice: number = existingProduct.finalPrice;
        if (body.originalPrice || body.discountPercent) {
            let originalPrice = body.originalPrice || existingProduct.originalPrice;
            let discountPercent = body.discountPercent || existingProduct.discountPercent;
            finalPrice = this.calculateFinalPrice(originalPrice, discountPercent);
        }

        if (!existingProduct.createdBy.equals(user._id) || user.role != RoleTypes.superadmin) {
            throw new UnauthorizedException('You are not authorized to update this product');
        }


        let modifiedCount = await this.ProductRepositoryService.updateOne({
            filter: { _id: productId },
            data: {
                ...body,
                image,
                gallery,
                finalPrice,
                folderId
            }
        });
        if (modifiedCount && files?.image) {
            await this.CloudService.deleteFile(existingProduct.image.public_id);
        }
        if (modifiedCount && files?.gallery && existingProduct.gallery && existingProduct.gallery.length > 0) {
            let publicIds = existingProduct.gallery.map(item => item.public_id);
            await this.CloudService.deleteFiles(publicIds);
        }

        return { message: 'Product updated successfully' };
    }

    async findAll(query?: ProductQueryDto): Promise<IProduct[] | IPaginate<IProduct>> {
        let filter = {};
        if (query?.name) {
            filter = {
                $or: [{ name: { $regex: query.name, $options: 'i' } },
                { slug: { $regex: query.name, $options: 'i' } }
                ]
            };
        }

        if (query?.categoryId) {
            filter['categoryId'] = query.categoryId;
        }
        if (query?.subcategoryId) {
            filter['subcategoryId'] = query.subcategoryId;
        }
        if (query?.brandId) {
            filter['brandId'] = query.brandId;
        }

        if (query?.minPrice || query?.maxPrice) {
            let max = query.maxPrice ? { $lte: query.maxPrice } : {};
            let min = query.minPrice ? { $gte: query.minPrice } : {};
            filter['finalPrice'] = { ...min, ...max };
        }



        return this.ProductRepositoryService.find({ filter, populate: query?.populate, select: query?.select, sort: query?.sort, page: query?.page, limit: query?.limit });
    }

    async findAllCached(): Promise<IProduct[] | IPaginate<IProduct>> {
        return this.ProductRepositoryService.find({});
    }

    private calculateFinalPrice(originalPrice: number, discount?: number): number {
        if (originalPrice <= 0) {
            throw new BadRequestException('invalid "original price"')
        }
        let price = originalPrice * (1 - (discount || 0) / 100);
        return price > 0 ? price : 0;
    }
    
}
