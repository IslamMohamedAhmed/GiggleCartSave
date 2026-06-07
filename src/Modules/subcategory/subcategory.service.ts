import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SubcategoryRepositoryService } from 'src/common/DP/subcategoryRepositoryService';
import { CloudService, IAttachments } from 'src/common/Services/cloudService';
import { type UserDocument } from 'src/Database/Models/user.model';
import { addSubcategoryDto } from './subcategoryDtos/addSubcategory.dto';
import { SubcategoryDocument } from 'src/Database/Models/subcategory.model';
import { v4 as uuidv4 } from 'uuid';
import { updateSubcategoryDto } from './subcategoryDtos/updateSubcategory.dto';
import { PopulateOptions, Types } from 'mongoose';
import { SubcategoryQueryDto } from './subcategoryDtos/subcategory.query.dto';
import { ISubcategory } from './subcategory.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
import { SubcategoryParamsIdDto } from './subcategoryDtos/subcategoryParamsId.dto';
import { CategoryRepositoryService } from 'src/common/DP/categoryRepositoryService';
@Injectable()
export class SubcategoryService {
    constructor(private readonly subcategoryRepository: SubcategoryRepositoryService,
        private readonly cloudService: CloudService,
        private readonly CategoryRepositoryService: CategoryRepositoryService
    ) { }

    async createSubcategory(user: UserDocument, body: addSubcategoryDto, file: Express.Multer.File): Promise<{ message: string, subcategory: SubcategoryDocument }> {
        const subcategoryName = await this.subcategoryRepository.findOne({ filter: { name: body.name } });
        const category = await this.CategoryRepositoryService.findOne({ filter: { _id: body.categoryId } });
        if (subcategoryName) {
            throw new ConflictException('Subcategory with this name already exists');
        }

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        let folderId = uuidv4();

        const { secure_url, public_id } = await this.cloudService.uploadFile(file, {
            folder: `${process.env.APP_NAME}/subcategories/${folderId}`,
        });
        const subcategoryData = {
            name: body.name,
            image: { secure_url, public_id },
            createdBy: user._id,
            categoryId: new Types.ObjectId(body.categoryId),
            folderId,
        }
        const subcategory = await this.subcategoryRepository.create(subcategoryData);
        return { message: "Successfully created subcategory", subcategory };
    }

    async updateSubcategory(user: UserDocument, subcategoryId: string, body?: updateSubcategoryDto, file?: Express.Multer.File):
        Promise<{ message: string }> {

        const subcategory = await this.subcategoryRepository.findOne({ filter: { _id: subcategoryId } });
        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }

        if(body?.categoryId){
            if(!await this.CategoryRepositoryService.findOne({ filter: { _id: body.categoryId } })){
                throw new NotFoundException('Category not found');
            }
        }

        if (body?.name && await this.subcategoryRepository.findOne({ filter: { name: body.name, _id: { $ne: subcategoryId } } })) {
            throw new ConflictException('Subcategory with this name already exists');
        }
        let data: { name?: string, image?: IAttachments } = {};
        if (file) {

            const { secure_url, public_id } = await this.cloudService.uploadFile(file, {
                folder: `${process.env.APP_NAME}/subcategories/${subcategory.folderId}`,
            });
            data.image = { secure_url, public_id };
        }
        data.name = body?.name;
        const modifiedCount = await this.subcategoryRepository.updateOne({
            filter: { _id: subcategoryId },
            data: {
                ...data
            }
        });
        if (modifiedCount && file) {
            await this.cloudService.deleteFile(subcategory.image.public_id);
        }
        return { message: "Successfully updated subcategory" };

    }

    async findById(id: string, populate?: PopulateOptions[]): Promise<SubcategoryDocument> {
        const subcategory = await this.subcategoryRepository.findById({ id, populate });
        if (!subcategory) {
            throw new BadRequestException('Subcategory not found');
        }
        return subcategory;
    }

    async findAll(query?: SubcategoryQueryDto): Promise<ISubcategory[] | IPaginate<ISubcategory>> {
        let filter: any = {};
        if (query?.name) {
            filter = {
                $or: [{ name: { $regex: query.name, $options: 'i' } },
                { slug: { $regex: query.name, $options: 'i' } }
                ]
            };
        }
        return this.subcategoryRepository.find({ filter, select: query?.select, sort: query?.sort, page: query?.page, limit: query?.limit });
    }

    async deleteSubcategory(param: SubcategoryParamsIdDto): Promise<{ message: string }> {
        const { subcategoryId } = param;
        let subcategory = await this.subcategoryRepository.findById({ id: subcategoryId });
        if (!subcategory) {
            throw new NotFoundException("Subcategory is not found!!");
        }
        await this.cloudService.deleteFolderAssets(`${process.env.APP_NAME}/subcategories/${subcategory.folderId}`);
        await this.subcategoryRepository.deleteById(subcategoryId);
        return { message: "Subcategory was deleted successfully" }
    }


}
