import { IsDefined, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class updateSubcategoryDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsMongoId()
    @IsOptional()
    @IsDefined({ message: 'categoryId is required' })
    @IsNotEmpty({ message: 'categoryId is required' })
    categoryId: string;
}