import { IsDefined, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class addSubcategoryDto {
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    @IsDefined({ message: 'name is required' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsMongoId()
    @IsDefined({ message: 'categoryId is required' })
    @IsNotEmpty({ message: 'categoryId is required' })
    categoryId: Types.ObjectId;
}
