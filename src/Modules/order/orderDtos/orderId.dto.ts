import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class orderIdDto{
    @IsMongoId()
    orderId:Types.ObjectId
}