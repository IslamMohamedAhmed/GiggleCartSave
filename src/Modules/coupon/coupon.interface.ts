import { Types } from "mongoose";

export interface ICoupon {
    code: string;
    discount: number;
    expiresAt: Date;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}