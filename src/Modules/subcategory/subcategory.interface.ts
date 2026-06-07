import { Types } from "mongoose";
import { IAttachments } from "src/common/Services/cloudService";

export interface ISubcategory {
    name: string;
    slug: string;
    image: IAttachments;
    folderId: string;
    createdBy: Types.ObjectId;
    categoryId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}