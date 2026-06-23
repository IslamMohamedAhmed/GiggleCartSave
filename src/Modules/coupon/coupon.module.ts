import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepositoryService } from 'src/common/DP/couponRepositoryService';
import { CouponModel } from 'src/Database/Models/coupon.model';

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepositoryService],
})
export class CouponModule { }
