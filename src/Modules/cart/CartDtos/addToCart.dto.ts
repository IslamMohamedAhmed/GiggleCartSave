import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsOptional, IsPositive } from "class-validator";
import { Types } from "mongoose";

export class addToCartDto {
    @IsMongoId({ message: 'Invalid product id format' })
    product: Types.ObjectId;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    quantity: number;

}

export class updateProductQuantityDto extends addToCartDto {}
