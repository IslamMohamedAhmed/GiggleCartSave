import { IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString, IsUppercase, Max, MaxLength, Min, MinLength } from "class-validator";
import { IsFutureDate } from "src/common/Custom-Decorators/date.decorator";

export class updateCouponDto {
    @IsString()
    @IsUppercase()
    @MinLength(5)
    @MaxLength(20)
    @IsNotEmpty()
    @IsOptional()
    code: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    discount: number;

    @IsFutureDate()
    @IsOptional()
    expiresAt: Date;
}