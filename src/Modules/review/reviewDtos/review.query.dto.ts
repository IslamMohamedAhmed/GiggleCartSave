import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsOptional, IsString, Max, MaxLength, maxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";
import { QueryFilterDTO } from "src/common/global-dtos/query.dto";

export class ReviewQueryDto extends QueryFilterDTO {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsOptional()
    text: string;

    @Type(() => Number)
    @Min(0)
    @Max(5)
    @IsOptional()
    minRating: number;

    @Type(() => Number)
    @Min(0)
    @Max(5)
    @IsOptional()
    maxRating: number;

    @IsMongoId()
    @IsOptional()
    productId: Types.ObjectId;

}