import { Types } from 'mongoose';
import { TokenService } from './../../common/Services/tokenService';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { connectedUsers, RoleTypes, UserDocument } from 'src/Database/Models/user.model';

export interface IAuthSocket extends Socket {
    user: UserDocument;
}


@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'chat',
})
export class realTimeGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer()
    private server: Server;
    constructor(private readonly TokenService: TokenService) { }

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    async handleConnection(client: Socket): Promise<void> {  // Fixed: 'viod' → 'void'
        try {
            console.log(client);
            const authorization = this.destructAuthorization(client);
            console.log({ authorization });
            const user = await this.TokenService.verifyToken({ authorization });
            console.log({ user });
            client['user'] = user;
            connectedUsers.set(user._id.toString(), client.id);
            console.log({ connectedUsers });  // Fixed: 'log' → 'console.log'
        } catch (error) {
            client.emit('exception', error?.message || 'fail to connect');
        }
    }

    handleDisconnect(client: IAuthSocket) {
        console.log({ c: client['user'] });
        connectedUsers.delete(client.user._id.toString());
        console.log(`Client disconnected ${client.id}`);  // Fixed: Template literal syntax
    }

    @Auth([RoleTypes.user, RoleTypes.admin, RoleTypes.superadmin])
    @SubscribeMessage('sayHi')
    sayHi(@MessageBody() data: any, @ConnectedSocket() socket: Socket): void {
        try {
            console.log(data);
            socket.emit('sayHi', { message: 'Hello from server Nest to postman!' });
        }
        catch (err) {

            socket.emit('exception', err?.message || 'fail to connect');
        }
    }

    emitStockChanges(
        data:
            {
                productId: Types.ObjectId; stock: number
                | {
                    productId: Types.ObjectId; stock: number
                }[]
            }): void {
        try {
            this.server.emit('stockChanges', data);
        } catch (error) {
            this.server.emit('exception', error.message || 'fail');
        }
    }

destructAuthorization(client: Socket): string {
    return (client.handshake.headers.authorization || client.handshake.auth.authorization);
}
}
