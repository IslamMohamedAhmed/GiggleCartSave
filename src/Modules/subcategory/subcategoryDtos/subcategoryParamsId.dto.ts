import { IsDefined, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class SubcategoryParamsIdDto {
    @IsDefined()
    @IsMongoId()
    @IsNotEmpty({ message: 'id should not be empty' })
    subcategoryId: Types.ObjectId;
}