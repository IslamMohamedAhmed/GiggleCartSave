import { IsDefined, IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class LoginDTO {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsDefined({ message: 'email is required' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;
    @IsString()
    @IsDefined({ message: 'password is required' })
    @IsNotEmpty({message: 'password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @MaxLength(100, { message: 'Password must be at most 100 characters' })
    @IsStrongPassword({},
        { message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol' })
    password: string;
}