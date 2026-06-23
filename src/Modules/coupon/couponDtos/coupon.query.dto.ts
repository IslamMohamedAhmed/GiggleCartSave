import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryFilterDTO } from "src/common/global-dtos/query.dto";

export class CouponQueryDto extends QueryFilterDTO {
    @IsString()
    @IsOptional()
    code?: string;

    @Type(() => Date)
    @IsOptional()
    minExpiringDate?: string;

    @Type(() => Date)
    @IsOptional()
    maxExpiringDate?: string;

    @Type(() => Number)
    @IsOptional()
    minDiscount?: number;

    @Type(() => Number)
    @IsOptional()
    maxDiscount?: number;
}