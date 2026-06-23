import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "src/common/DP/repository.dp";
import { Category, CategoryDocument } from "src/Database/Models/category.model";

@Injectable()
export class CategoryRepositoryService extends DataBaseRepository<CategoryDocument> {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
        super(categoryModel);
    }
}


