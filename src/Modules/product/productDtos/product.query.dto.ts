import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { QueryFilterDTO } from "src/common/global-dtos/query.dto";

export class ProductQueryDto extends QueryFilterDTO {
    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    minPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    maxPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsMongoId()
    @IsOptional()
    categoryId?: string;

    @IsMongoId()
    @IsOptional()
    subcategoryId?: string;

    @IsMongoId()
    @IsOptional()
    brandId?: string;
}