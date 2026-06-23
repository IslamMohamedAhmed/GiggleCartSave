import { Types } from "mongoose";
import { IAttachments } from "src/common/Services/cloudService";

export interface ICategory {
    name: string;
    slug: string;
    logo: IAttachments;
    folderId: string;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}