import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { Order, OrderDocument } from "src/Database/Models/order.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class OrderRepositoryService extends DataBaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {
        super(orderModel);
    }
}

