import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { Coupon, CouponDocument } from "src/Database/Models/coupon.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";




@Injectable()
export class CouponRepositoryService extends DataBaseRepository<CouponDocument> {
    constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {
        super(couponModel);
    }
}




