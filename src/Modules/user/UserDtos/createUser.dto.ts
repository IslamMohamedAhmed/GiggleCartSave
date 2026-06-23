import {
    IsString,
    IsEmail,
    IsOptional,
    IsEnum,
    IsDateString,
    IsPhoneNumber,
    MinLength,
    MaxLength,
    Matches,
    IsDefined,
    IsNotEmpty,
    IsStrongPassword,
} from 'class-validator';
import { GenderTypes, RoleTypes } from 'src/Database/Models/user.model';
export class CreateUserDto {
    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    @MaxLength(101, { message: 'Username must be at most 101 characters' })
    username?: string;

    @IsString()
    @IsDefined({ message: 'firstName is required' })
    @IsNotEmpty({ message: 'firstName is required' })
    @MinLength(2, { message: 'First name must be at least 2 characters' })
    @MaxLength(50,)
    firstName: string;

    @IsString()
    @IsDefined({ message: 'lastName is required' })
    @IsNotEmpty({ message: 'lastName is required' })
    @MinLength(2, { message: 'Last name must be at least 2 characters' })
    @MaxLength(50, { message: 'Last name must be at most 50 characters' })
    lastName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsDefined({ message: 'email is required' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @IsString()
    @IsDefined({ message: 'password is required' })
    @IsNotEmpty({ message: 'password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @MaxLength(100, { message: 'Password must be at most 100 characters' })
    @IsStrongPassword({},
        { message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol' })
    password: string;

    @IsOptional()
    @IsPhoneNumber('EG', { message: 'Invalid phone number format for Egypt' }) // since you're in Egypt 🇪🇬
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;

    @IsOptional()
    @IsDateString()
    DOB?: Date;

    @IsOptional()
    @IsDateString()
    confirmEmail?: Date;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    confirmEmailOtp?: string;

    @IsOptional()
    @IsEnum(GenderTypes)
    gender?: GenderTypes;

    @IsOptional()
    @IsEnum(RoleTypes)
    role?: RoleTypes;
}