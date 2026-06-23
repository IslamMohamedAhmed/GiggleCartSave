import { CategoryRepositoryService } from '../../common/DP/categoryRepositoryService';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudService, IAttachments } from 'src/common/Services/cloudService';
import { addCategoryDto } from './categoryDtos/addCategory.dto';
import { UserDocument } from 'src/Database/Models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { CategoryDocument } from 'src/Database/Models/category.model';
import { PopulateOptions, Types } from 'mongoose';
import { CategoryQueryDto } from './categoryDtos/category.query.dto';
import { ICategory } from './category.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
import { categoryParamsIdDto } from './categoryDtos/categoryParamsId.dto';
import { updateCategoryDto } from './categoryDtos/updateCategory.dto';

@Injectable()
export class CategoryService {


    constructor(private readonly cloudService: CloudService,
        private readonly categoryRepositoryService: CategoryRepositoryService) { }

    async createCategory(user: UserDocument, body: addCategoryDto, file: Express.Multer.File): Promise<{ message: string, category: CategoryDocument }> {
        const categoryName = await this.categoryRepositoryService.findOne({ filter: { name: body.name } });

        if (categoryName) {
            throw new BadRequestException('Category with this name already exists');
        }

        let folderId = uuidv4();

        const { secure_url, public_id } = await this.cloudService.uploadFile(file, {
            folder: `${process.env.APP_NAME}/categories/${folderId}`,
        });
        const categoryData = {
            name: body.name,
            logo: { secure_url, public_id },
            createdBy: user._id,
            folderId,
        }
        const category = await this.categoryRepositoryService.create(categoryData);
        return { message: "Successfully created category", category };
    }

    async updateCategory(user: UserDocument, categoryId: Types.ObjectId, body?: updateCategoryDto, file?: Express.Multer.File):
        Promise<{ message: string }> {

        const category = await this.categoryRepositoryService.findOne({ filter: { _id: categoryId } });
        if (!category) {
            throw new BadRequestException('Category not found');
        }

        if (body?.name && await this.categoryRepositoryService.findOne({ filter: { name: body.name, _id: { $ne: categoryId } } })) {
            throw new ConflictException('Category with this name already exists');
        }
        if (!user._id.equals(category.createdBy)) {
            throw new BadRequestException('Invalid request, you are not the creator of this category');
        }
        let data: { name?: string, logo?: IAttachments } = {};
        if (file) {

            const { secure_url, public_id } = await this.cloudService.uploadFile(file, {
                folder: `${process.env.APP_NAME}/categories/${category.folderId}`,
            });
            data.logo = { secure_url, public_id };
        }
        data.name = body?.name;
        const modifiedCount = await this.categoryRepositoryService.updateOne({
            filter: { _id: categoryId },
            data: {
                ...data
            }
        });
        if (modifiedCount && file) {
            await this.cloudService.deleteFile(category.logo.public_id);
        }
        return { message: "Successfully updated category" };

    }

    async findById(id: Types.ObjectId, populate?: PopulateOptions[]): Promise<CategoryDocument> {
        const category = await this.categoryRepositoryService.findById({ id, populate });
        if (!category) {
            throw new BadRequestException('Category not found');
        }
        return category;
    }

    async findAll(query?: CategoryQueryDto): Promise<ICategory[] | IPaginate<ICategory>> {
        let filter = {};
        if (query?.name) {
            filter = {
                $or: [{ name: { $regex: query.name, $options: 'i' } },
                { slug: { $regex: query.name, $options: 'i' } }
                ]
            };
        }
        return this.categoryRepositoryService.find({ filter, populate: query?.populate, select: query?.select, sort: query?.sort, page: query?.page, limit: query?.limit });
    }

    async deleteCategory(user: UserDocument, param: categoryParamsIdDto): Promise<{ message: string }> {
        const { categoryId } = param;
        let category = await this.categoryRepositoryService.findById({ id: categoryId });
        if (!category) {
            throw new NotFoundException("category is not found!!");
        }
        if (!user._id.equals(category.createdBy)) {
            throw new BadRequestException('Invalid request, you are not the creator of this category');
        }
        await this.cloudService.deleteFolderAssets(`${process.env.APP_NAME}/categories/${category.folderId}`);
        await this.categoryRepositoryService.deleteById(categoryId);
        return { message: "category was deleted successfully" }
    }




}
