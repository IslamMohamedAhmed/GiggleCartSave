import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from 'src/common/DP/userRepositoryService';
import { TokenService } from 'src/common/Services/tokenService';
import { UserModel } from 'src/Database/Models/user.model';
@Global()
@Module({
    imports: [UserModel],
    providers: [JwtService, UserRepositoryService, TokenService],
    exports: [JwtService, UserRepositoryService, TokenService, UserModel],
})
export class GlobalAuthenticationModuleTsModule { }
