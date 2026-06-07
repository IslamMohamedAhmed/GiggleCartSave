import { Optional } from "@nestjs/common";
import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class updateCategoryDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;
}