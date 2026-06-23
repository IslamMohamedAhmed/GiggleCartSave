import { IsDefined, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class categoryParamsIdDto {
    @IsDefined()
    @IsMongoId()
    @IsNotEmpty({ message: 'id should not be empty' })
    categoryId: Types.ObjectId;
}