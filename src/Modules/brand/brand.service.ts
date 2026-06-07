import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepositoryService } from 'src/common/DP/brandRepositoryService';
import { UserDocument } from 'src/Database/Models/user.model';
import { addBrandDto } from './brandDtos/addBrand.dto';
import { BrandDocument } from 'src/Database/Models/brand.model';
import {v4 as uuidv4} from 'uuid';
import { CloudService, IAttachments } from 'src/common/Services/cloudService';
import { updateBrandDto } from './brandDtos/updateBrand.dto';
import { PopulateOptions } from 'mongoose';
import { BrandQueryDto } from './brandDtos/brand.query.dto';
import { IBrand } from './brand.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
import { brandParamsIdDto } from './brandDtos/brandParamsId.dto';
@Injectable()
export class BrandService {
    constructor(private readonly brandRepository: BrandRepositoryService,
        private readonly cloudService: CloudService
    ) { }
       


    async createBrand(user: UserDocument, body: addBrandDto, file: Express.Multer.File): Promise<{ message: string, brand: BrandDocument }>{
          const brandName = await this.brandRepository.findOne({ filter: { name: body.name } });

        if (brandName) {
            throw new BadRequestException('Brand with this name already exists');
        }

        let folderId = uuidv4();

        const { secure_url, public_id } = await this.cloudService.uploadFile(file, {
            folder: `${process.env.APP_NAME}/brands/${folderId}`,
        });
        const brandData = {
            name: body.name,
            logo: { secure_url, public_id },
            createdBy: user._id,
            folderId,
        }
        const brand = await this.brandRepository.create(brandData);
        return { message: "Successfully created brand", brand };
    }
    
     async updateBrand(user: UserDocument, brandId: string, body?: updateBrandDto, file?: Express.Multer.File):
            Promise<{ message: string }> {
    
            const brand = await this.brandRepository.findOne({ filter: { _id: brandId } });
            if (!brand) {
                throw new BadRequestException('Brand not found');
            }
    
            if (body?.name && await this.brandRepository.findOne({ filter: { name: body.name, _id: { $ne: brandId } } })) {
                throw new ConflictException('Brand with this name already exists');
            }
            let data: { name?: string, logo?: IAttachments } = {};
            if (file) {
    
                const { secure_url, public_id } = await this.cloudService.uploadFile(file, {
                    folder: `${process.env.APP_NAME}/brands/${brand.folderId}`,
                });
                data.logo = { secure_url, public_id };
            }
            data.name = body?.name;
            const modifiedCount = await this.brandRepository.updateOne({
                filter: { _id: brandId },
                data: {
                    ...data
                }
            });
            if (modifiedCount && file) {
                await this.cloudService.deleteFile(brand.logo.public_id);
            }
            return { message: "Successfully updated brand" };
    
        }
    
        async findById(id: string, populate?: PopulateOptions[]): Promise<BrandDocument> {
            const brand = await this.brandRepository.findById({ id, populate });
            if (!brand) {
                throw new BadRequestException('Brand not found');
            }
            return brand;
        }
    
        async findAll(query?: BrandQueryDto): Promise<IBrand[] | IPaginate<IBrand>> {
            let filter: any = {};
            if (query?.name) {
                filter = {
                    $or: [{ name: { $regex: query.name, $options: 'i' } },
                    { slug: { $regex: query.name, $options: 'i' } }
                    ]
                };
            }
            return this.brandRepository.find({ filter, select: query?.select, sort: query?.sort, page: query?.page, limit: query?.limit });
        }
    
        async deleteBrand(param: brandParamsIdDto): Promise<{ message: string }> {
            const { brandId } = param;
            let brand = await this.brandRepository.findById({ id: brandId });
            if (!brand) {
                throw new NotFoundException("brand is not found!!");
            }
            await this.cloudService.deleteFolderAssets(`${process.env.APP_NAME}/brands/${brand.folderId}`);
            await this.brandRepository.deleteById(brandId);
            return { message: "brand was deleted successfully" }
        }
    
    
    

    }
