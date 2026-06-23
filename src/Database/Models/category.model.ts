import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import * as cloudService from "src/common/Services/cloudService";
import { ICategory } from "src/Modules/category/category.interface";

@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Category implements ICategory {

    @Prop({ unique: true, required: true, minlength: 2, maxlength: 50 })
    name: string;

    @Prop({ required: true, minlength: 2, maxlength: 75, default: function (this: Category) { return slugify(this.name, { trim: true }) } })
    slug: string;

    @Prop({ type: { secure_url: String, public_id: String }, required: true })
    logo: cloudService.IAttachments;

    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ required: true, type: String })
    folderId: string;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([
    { name: Category.name, schema: CategorySchema }
]);

CategorySchema.pre('updateOne', async function (next: NextFunction) {
    const update = this.getUpdate();
    if (update) {
        if (update['name']) {
            update['slug'] = slugify(update['name'], { trim: true });
        }
        this.setUpdate(update);
    }
});