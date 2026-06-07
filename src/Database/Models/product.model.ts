import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import * as cloudService from "src/common/Services/cloudService";
import { IProduct, ProductSize } from "src/Modules/product/product.interface";

@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Product implements IProduct {

    @Prop({ unique: true, required: true, minlength: 2, maxlength: 50 })
    name: string;

    @Prop({ required: true, minlength: 10, maxlength: 50000 })
    description: string;

    @Prop({ required: true, type: Number, default: 1 })
    stock: number;

    @Prop({ required: true, type: Number })
    originalPrice: number;

    @Prop({ required: true, type: Number })
    discountPercent: number;

    @Prop({ required: true, type: Number })
    finalPrice: number;


    @Prop({ required: false, type: [String] })
    colors?: string[];

    @Prop({ required: false, type: [String], enum: ProductSize })
    size?: ProductSize[];

    @Prop(
        raw({
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        }),
    )
    image: cloudService.IAttachments;

    @Prop(
        raw([
            {
                secure_url: { type: String, required: true },
                public_id: { type: String, required: true },
            },
        ]),
    )
    gallery?: cloudService.IAttachments[];

    @Prop({
        required: true, minlength: 2, maxlength: 75,
        default: function (this: Product) { return slugify(this.name, { trim: true }) }
    })
    slug: string;

    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    createdBy: Types.ObjectId;

    @Prop({ required: true, type: String })
    folderId: string;


    @Prop({ required: true, ref: 'Category', type: Types.ObjectId })
    categoryId: Types.ObjectId;


    @Prop({ required: true, ref: 'Subcategory', type: Types.ObjectId })
    subcategoryId: Types.ObjectId;

    @Prop({ required: true, ref: 'Brand', type: Types.ObjectId })
    brandId: Types.ObjectId;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema }
]);

ProductSchema.pre('updateOne', async function (next: NextFunction) {
    const update = this.getUpdate();
    if (update) {
        if (update['name']) {
            update['slug'] = slugify(update['name'], { trim: true });
        }
        this.setUpdate(update);
    }
});