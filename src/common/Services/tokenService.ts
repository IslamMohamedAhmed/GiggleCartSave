import { UserRepositoryService } from '../DP/userRepositoryService';
import { JwtPayload } from 'jsonwebtoken';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Types } from 'mongoose';
import { RoleTypes } from 'src/Database/Models/user.model';

@Injectable()
export class TokenService {
    constructor(private readonly jwt: JwtService, private readonly UserRepositoryService: UserRepositoryService) { }



    generateToken({ payload,
        type = TokenTypes.ACCESS,
        role = RoleTypes.user,
        expiresIn = parseInt(process.env.EXPIRES_IN + "")
    }: IGenerateTokenOptions) {
        const { accessSignature, refreshSignature } = this.getSignature(role);
        const secret = type === TokenTypes.ACCESS ? accessSignature : refreshSignature;
        expiresIn = type === TokenTypes.ACCESS ? expiresIn : parseInt(process.env.EXPIRES_REFRESH_IN + "");
        return this.jwt.sign(payload, { secret, expiresIn });
    }

    private getSignature(role: RoleTypes): { accessSignature: string, refreshSignature: string } {
        let accessSignature: string;
        let refreshSignature: string;
        switch (role) {
            case RoleTypes.admin:
                accessSignature = process.env.ADMIN_ACCESS_TOKEN_SIGNATURE + "";
                refreshSignature = process.env.ADMIN_REFRESH_TOKEN_SIGNATURE + "";
                break;
            case RoleTypes.superadmin:
                accessSignature = process.env.SUPERADMIN_ACCESS_TOKEN_SIGNATURE + "";
                refreshSignature = process.env.SUPERADMIN_REFRESH_TOKEN_SIGNATURE + "";
                break;
            default:
                accessSignature = process.env.USER_ACCESS_TOKEN_SIGNATURE + "";
                refreshSignature = process.env.USER_REFRESH_TOKEN_SIGNATURE + "";
        }
        return { accessSignature, refreshSignature };
    }
    
    async verifyToken({ authorization, type = TokenTypes.ACCESS }: IVerifyToken) {
        try {
            const [bearer, token] = authorization.split(' ') || [];
            if (!bearer || !token) {
                throw new BadRequestException('Missing token');
            }

            const { accessSignature, refreshSignature } = this.getSignature(
                bearer === BearerTypes.superSystem ?
                    RoleTypes.superadmin : bearer === BearerTypes.System ? RoleTypes.admin : RoleTypes.user);

            const decoded = this.jwt.verify(token, {
                secret: type === TokenTypes.ACCESS ? accessSignature : refreshSignature,
            });

            if (!decoded?.id) {
                throw new UnauthorizedException('Unauthenticated user');
            }

            const user = await this.UserRepositoryService.findOne({
                filter: { _id: decoded.id },
            });

            if (!user) {
                throw new NotFoundException('Not register account');
            }

            if (user.changeCredentialTime?.getTime() > decoded.iat * 1000) {
                throw new UnauthorizedException('Credentials have been changed. Please login again');
            }

            return user;
        }
        catch (error) {
            throw new BadRequestException('Invalid token');
        }
    }
}
interface ITokenPayload extends JwtPayload {
    id: Types.ObjectId;
}

interface IGenerateTokenOptions {
    payload: ITokenPayload;
    type?: TokenTypes;
    role?: RoleTypes;
    expiresIn?: number;
}

interface IVerifyToken {
    authorization: string;
    type?: TokenTypes;
}
export enum BearerTypes {
    System = "System",
    Bearer = "Bearer",
    superSystem = "superSystem"
}



export enum TokenTypes {
    ACCESS = "ACCESS",
    REFRESH = "REFRESH"
}