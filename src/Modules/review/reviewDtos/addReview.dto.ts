import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";

export class AddReviewDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(1000)
    text: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;

    @IsMongoId()
    @IsNotEmpty()
    productId: Types.ObjectId;
}