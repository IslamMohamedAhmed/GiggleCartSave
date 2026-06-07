import { JwtService } from '@nestjs/jwt';
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryService } from '../../common/DP/userRepositoryService';
import { CreateUserDto } from './UserDtos/createUser.dto';
import { MailService } from 'src/common/Email/sendEmail';
import { createTemplate } from 'src/common/Email/accountVerificationTemplate';
import { not } from 'rxjs/internal/util/not';
import { PasswordService } from 'src/common/Services/passwordService';
import { LoginDTO } from './UserDtos/Login.dto';
import { UserDocument } from 'src/Database/Models/user.model';
import { TokenService, TokenTypes } from 'src/common/Services/tokenService';

@Injectable()
export class UserService {
  constructor(private userRepositoryService: UserRepositoryService,
    private mailService: MailService, private tokenService: TokenService) {
  }
  async signup(data: CreateUserDto) {
    await this.userRepositoryService.checkEmailExists({ email: data.email });
    data.confirmEmailOtp = this.generateOTP();
    await this.userRepositoryService.create(data);
    this.mailService.sendMail({
      to: data.email,
      subject: "Verify your email - GiggleCart",
      html: createTemplate(data.confirmEmailOtp)
    });
    return { message: "User created successfully, message was sent to verify your account!!" };
  }

  async confirmEmail(data: { email: string, otp: string }) {
    const user =
      await this.userRepositoryService
        .findOne({ filter: { email: data.email, confirmEmail: { $exists: false } } });
    if (!user) throw new NotFoundException("User not found or already registered!!");
    if (!PasswordService.compare(data.otp, user.confirmEmailOtp)) throw new BadRequestException("Invalid OTP");
    await this.userRepositoryService.updateOne({ filter: { email: data.email }, data: { confirmEmail: new Date(), confirmEmailOtp: undefined } });
    return { message: "Email confirmed successfully" };
  }

  async login(
    body: LoginDTO,
  ): Promise<{ message: string; data: { accessToken: string; refreshToken: string } }> {
    const { email, password } = body;
    const user = await this.userRepositoryService.findOne({
      filter: { email },
    });

    if (!user) {
      throw new NotFoundException('Not register account');
    }

    if (!user.confirmEmail) {
      throw new BadGatewayException(
        'Sorry you have to verify your account first',
      );
    }

    if (!PasswordService.compare(password, user.password)) {
      throw new BadRequestException('In-valid login Data');
    }
    let accessToken = this.tokenService.generateToken({
      payload: { id: user._id },
      role: user.role
    });
    let refreshToken = this.tokenService.generateToken({
      payload: { id: user._id },
      role: user.role,
      type: TokenTypes.REFRESH,
      expiresIn: parseInt(process.env.REFRESH_EXPIRES_IN + "")
    });
    return { message: 'Done', data: { accessToken, refreshToken } };
  }

  private generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
