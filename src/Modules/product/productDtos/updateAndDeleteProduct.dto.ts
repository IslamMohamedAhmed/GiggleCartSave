import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDTO } from "./addProduct.dto";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class updateProductDto extends PartialType(CreateProductDTO) {}


export class productIdDto {
    @IsMongoId()
    productId: Types.ObjectId;
}