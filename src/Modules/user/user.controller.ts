import { Body, Controller, Get, HttpCode, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './UserDtos/createUser.dto';
import { ConfirmEmailDto } from './UserDtos/confirmEmail.dto';
import { LoginDTO } from './UserDtos/Login.dto';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { type UserDocument } from 'src/Database/Models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async signUp(@Body() body: CreateUserDto) {
    return this.userService.signup(body);
  }

  @Post('confirm-email')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    return this.userService.confirmEmail(body);
  }

  @HttpCode(200)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async login(@Body() body: LoginDTO) {
    return this.userService.login(body);
  }

  @Patch('change-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async changePassword(@Body() body: { oldPassword: string, newPassword: string }, @User() user: UserDocument) {
    return this.userService.changePassword(user, body.oldPassword, body.newPassword);
  }

  @Get('request-reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async requestResetPassword(@Body() body: { email: string }) {
    return this.userService.requestResetPassword(body.email);
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async resetPassword(@Body() body: { email: string, otp: string, newPassword: string }) {
    return this.userService.resetPassword(body.email, body.otp, body.newPassword);
  }
}
