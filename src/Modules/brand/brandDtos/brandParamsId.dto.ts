import { IsDefined, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class brandParamsIdDto {
    @IsDefined()
    @IsMongoId()
    @IsNotEmpty({ message: 'id should not be empty' })
    brandId: string;
}