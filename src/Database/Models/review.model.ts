import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IReview } from "src/Modules/review/review.interface";

@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Review implements IReview {

    @Prop({ type: String, required: true, trim: true, minlength: 10, maxlength: 1000 })
    text: string;

    @Prop({ required: true, type: Number, min: 0, max: 5, default: 0 })
    rating: number;

    @Prop({ required: true, ref: 'Product', type: Types.ObjectId })
    productId: Types.ObjectId;

    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    createdBy: Types.ObjectId;
}

export type ReviewDocument = HydratedDocument<Review>;
export const ReviewSchema = SchemaFactory.createForClass(Review);
export const ReviewModel = MongooseModule.forFeature([
    { name: Review.name, schema: ReviewSchema }
]);



