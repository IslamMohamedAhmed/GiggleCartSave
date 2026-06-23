import { Types } from "mongoose";

export interface IReview {
    text: string;
    productId: Types.ObjectId;
    createdBy: Types.ObjectId;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
}

