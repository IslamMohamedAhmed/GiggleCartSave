import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { Subcategory, SubcategoryDocument } from "src/Database/Models/subcategory.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SubcategoryRepositoryService extends DataBaseRepository<SubcategoryDocument> {
    constructor(@InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>) {
        super(subcategoryModel);
    }
}

