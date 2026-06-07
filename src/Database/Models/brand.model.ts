import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import * as cloudService from "src/common/Services/cloudService";
import { IBrand } from "src/Modules/brand/brand.interface";

@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Brand implements IBrand {

    @Prop({ unique: true, required: true, minlength: 2, maxlength: 50 })
    name: string;

    @Prop({ required: true, minlength: 2, maxlength: 75, default: function (this: Brand) { return slugify(this.name, { trim: true }) } })
    slug: string;

    @Prop({ type: { secure_url: String, public_id: String }, required: true })
    logo: cloudService.IAttachments;

    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ required: true, type: String })
    folderId: string;
}

export type BrandDocument = HydratedDocument<Brand>;
export const BrandSchema = SchemaFactory.createForClass(Brand);
export const BrandModel = MongooseModule.forFeature([
    { name: Brand.name, schema: BrandSchema }
]);

BrandSchema.pre('updateOne', async function (next: NextFunction) {
    const update = this.getUpdate();
    if (update) {
        if (update['name']) {
            update['slug'] = slugify(update['name'], { trim: true });
        }
        this.setUpdate(update);
    }
});