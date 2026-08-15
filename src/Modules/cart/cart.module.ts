import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartModel } from 'src/Database/Models/cart.model';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { CartRepositoryService } from 'src/common/DP/cartRepositoryService';
import { ProductModel } from 'src/Database/Models/product.model';
import { CouponRepositoryService } from 'src/common/DP/couponRepositoryService';
import { CouponModel } from 'src/Database/Models/coupon.model';
import { WishlistService } from '../wishlist/wishlist.service';

@Module({
  imports: [ProductModel, CartModel, CouponModel],
  controllers: [CartController],
  providers: [CartService, ProductRepositoryService, CartRepositoryService, CouponRepositoryService, WishlistService],
  exports: [CartService, CartRepositoryService]
})
export class CartModule { }
