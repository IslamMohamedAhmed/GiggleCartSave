import { IsNotEmpty, isNotEmpty, IsNumber, IsString, IsUppercase, Max, MaxLength, Min, MinLength } from "class-validator";
import { IsFutureDate } from "src/common/Custom-Decorators/date.decorator";

export class AddCouponDto {
    @IsString()
    @IsUppercase()
    @MinLength(5)
    @MaxLength(20)
    @IsNotEmpty()
    code: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    discount: number;

    @IsFutureDate()
    expiresAt: Date;
}