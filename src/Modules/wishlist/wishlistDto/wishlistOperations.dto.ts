import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsOptional, IsPositive } from "class-validator";
import { Types } from "mongoose";

export class wishlistOperationsDto {
    @IsMongoId({ message: 'Invalid product id format' })
    productId: Types.ObjectId;
}

export class updateProductQuantityDto extends wishlistOperationsDto {}
