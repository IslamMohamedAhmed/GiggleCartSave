import { IsDefined, IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class couponParamsDto {
    @IsMongoId()
    @IsDefined()
    @IsNotEmpty({ message: 'couponId should not be empty' })
    couponId: Types.ObjectId;
}