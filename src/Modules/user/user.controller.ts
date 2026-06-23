import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './UserDtos/createUser.dto';
import { ConfirmEmailDto } from './UserDtos/confirmEmail.dto';
import { LoginDTO } from './UserDtos/Login.dto';

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
}
