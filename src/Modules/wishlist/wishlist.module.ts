import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { CartRepositoryService } from 'src/common/DP/cartRepositoryService';
import { CartService } from '../cart/cart.service';
import { CouponRepositoryService } from 'src/common/DP/couponRepositoryService';
import { CouponModel } from 'src/Database/Models/coupon.model';
import { CartModel } from 'src/Database/Models/cart.model';
import { ProductModel } from 'src/Database/Models/product.model';

@Module({
  imports: [CouponModel, CartModel, ProductModel],
  controllers: [WishlistController],
  providers: [WishlistService, CartService, CouponRepositoryService, CartRepositoryService, ProductRepositoryService],
  exports: [WishlistService]
})
export class WishlistModule { }
