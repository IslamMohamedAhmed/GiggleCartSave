import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepositoryService } from 'src/common/DP/orderRepositoryService';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { OrderModel } from 'src/Database/Models/order.model';
import { ProductModel } from 'src/Database/Models/product.model';
import { CartModel } from 'src/Database/Models/cart.model';
import { CartRepositoryService } from 'src/common/DP/cartRepositoryService';
import { CartService } from '../cart/cart.service';
import { CouponModel } from 'src/Database/Models/coupon.model';
import { CouponRepositoryService } from 'src/common/DP/couponRepositoryService';
import { PaymentService } from 'src/common/Services/paymentService';
import { realTimeGateway } from '../gateway/gateway';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [OrderModel, ProductModel, CartModel, CouponModel, CartModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepositoryService,
    ProductRepositoryService,
    CartRepositoryService, CouponRepositoryService, PaymentService, realTimeGateway],
})
export class OrderModule { }
