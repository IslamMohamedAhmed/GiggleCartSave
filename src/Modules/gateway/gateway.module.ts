import { Module } from '@nestjs/common';
import { realTimeGateway } from './gateway';

@Module({
    providers: [realTimeGateway],
})
export class GatewayModule { }
