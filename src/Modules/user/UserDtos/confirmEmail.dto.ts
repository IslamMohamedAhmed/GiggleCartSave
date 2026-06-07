import { IsDefined, IsEmail, IsNotEmpty, Matches } from "class-validator";

export class ConfirmEmailDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsDefined({ message: 'email is required' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;
    @IsDefined({ message: 'otp is required' })
    @IsNotEmpty({ message: 'otp is required' })
    @Matches(/^\d{6}$/, { message: 'invalid otp' })
    otp: string;
}

