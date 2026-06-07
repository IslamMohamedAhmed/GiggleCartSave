import { IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class addBrandDto {
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    @IsDefined({ message: 'name is required' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;
}
