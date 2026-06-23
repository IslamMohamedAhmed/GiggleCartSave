import { Types } from "mongoose";
import { IAttachments } from "src/common/Services/cloudService";


export enum ProductSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
    XXXL = 'XXXL'
}

export interface IProduct {
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    stock: number;
    originalPrice: number;
    discountPercent: number;
    finalPrice: number;
    folderId: string;
    image: IAttachments;
    gallery?: IAttachments[];
    colors?: string[];
    size?: ProductSize[];
    categoryId: Types.ObjectId;
    subcategoryId: Types.ObjectId;
    brandId: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}