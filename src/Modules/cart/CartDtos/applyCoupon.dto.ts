import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class applyCouponDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}