import { IsDefined, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class categoryParamsIdDto {
    @IsDefined()
    @IsMongoId()
    @IsNotEmpty({ message: 'id should not be empty' })
    categoryId: string;
}