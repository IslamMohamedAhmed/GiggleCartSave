import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from 'src/common/DP/userRepositoryService';
import { PasswordService } from 'src/common/Services/passwordService';
import { TokenService } from 'src/common/Services/tokenService';
import { UserModel } from 'src/Database/Models/user.model';
@Global()
@Module({
    imports: [UserModel],
    providers: [JwtService, UserRepositoryService, TokenService, PasswordService],
    exports: [JwtService, UserRepositoryService, TokenService, PasswordService, UserModel],
})
export class GlobalAuthenticationModuleTsModule { }
