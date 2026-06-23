import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class removeFromCartDto {
    @IsMongoId({ message: 'Invalid product id format' })
    productId: Types.ObjectId;

}
