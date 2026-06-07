import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { ProductSize } from "../product.interface";
import { Types } from "mongoose";

export class CreateProductDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  originalPrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  discountPercent?: number;

  @IsMongoId()
  categoryId: Types.ObjectId;

  @IsMongoId()
  subcategoryId: Types.ObjectId;
  
  @IsMongoId()
  brandId: Types.ObjectId;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  colors?: string[];

  @IsArray()
  @IsOptional()
  size?: ProductSize[];
}