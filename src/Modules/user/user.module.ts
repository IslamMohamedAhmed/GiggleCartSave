import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from 'src/Database/Models/user.model';
import { MailService } from 'src/common/Email/sendEmail';

@Module({
  imports: [UserModel],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule { }
