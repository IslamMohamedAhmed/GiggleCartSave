import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PaymentMethod } from "../order.interface";


export class CreateOrderDto {
    @IsString()
    @MinLength(2)
    @MaxLength(1000)
    address: string;

    @Matches(/^(\+2|002)?01[0125][0-9]{8}$/)
    phone: string;

    @IsString()
    @MinLength(2)
    @MaxLength(5000)
    @IsOptional()
    note?: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}