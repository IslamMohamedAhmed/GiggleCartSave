import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";

export class UpdateReviewDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(1000)
    @IsOptional()
    text?: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    rating?: number;
}