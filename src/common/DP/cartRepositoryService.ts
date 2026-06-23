import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { Cart, CartDocument } from "src/Database/Models/cart.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";



@Injectable()
export class CartRepositoryService extends DataBaseRepository<CartDocument> {
    constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {
        super(cartModel);
    }
}




