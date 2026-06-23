import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class ReviewParamDto {
    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId;
}