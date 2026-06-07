import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { Product, ProductDocument } from "src/Database/Models/product.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class ProductRepositoryService extends DataBaseRepository<ProductDocument> {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {
        super(productModel);
    }
}


