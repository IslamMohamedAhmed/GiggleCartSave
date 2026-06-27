import { Body, Controller, Param, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { CreateOrderDto } from './orderDtos/createOrder.dto';
import { OrderDocument } from 'src/Database/Models/order.model';
import { orderIdDto } from './orderDtos/orderId.dto';
import Stripe from 'node_modules/stripe/esm/stripe.esm.node';
import type { Request, Response } from 'express';
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }
 

  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin, RoleTypes.user])
  async createOrder(@User() user: UserDocument, @Body() body: CreateOrderDto): Promise<{ message: string, order: OrderDocument }> {
    return this.orderService.createOrder(user, body);
  }
  
  @Post('webhook')
  async webhook(@Req() req: Request) {
    return this.orderService.webhook(req);
  }

  @Post(':orderId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin, RoleTypes.user])
  async checkoutSession(@User() user: UserDocument, @Param() param: orderIdDto): Promise<{
    message: string;
    data: { session: Stripe.Response<Stripe.Checkout.Session> };
  }> {
    return this.orderService.checkout(user, param.orderId);
  }


 


}
