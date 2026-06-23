import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ICoupon } from "src/Modules/coupon/coupon.interface";

@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Coupon implements ICoupon {

    @Prop({ unique: true, required: true, trim: true})
    code: string;

    @Prop({ required: true, type: Number, min: 0, max: 100 })
    discount: number;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    createdBy: Types.ObjectId;
}

export type CouponDocument = HydratedDocument<Coupon>;
export const CouponSchema = SchemaFactory.createForClass(Coupon);
export const CouponModel = MongooseModule.forFeature([
    { name: Coupon.name, schema: CouponSchema }
]);



