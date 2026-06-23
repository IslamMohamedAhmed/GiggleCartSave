import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { AddCouponDto } from './couponDtos/addCoupon.dto';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { CouponQueryDto } from './couponDtos/coupon.query.dto';
import { couponParamsDto } from './couponDtos/couponParamsDto';
import { updateCouponDto } from './couponDtos/updateCoupon.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  async createCoupon(@User() user: UserDocument, @Body() body: AddCouponDto) {
    return await this.couponService.addCoupon(user, body);
  }

  @Get()
  async getAllCoupons(@Query() query: CouponQueryDto) {
    return await this.couponService.getAllCoupons(query);
  }

  @Get(':couponId')
  async getCouponById(@Param() param: couponParamsDto) {
    return await this.couponService.getSingleCoupon(param);
  }

  @Put(':couponId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  async updateCoupon(@User() user: UserDocument, @Param() param: couponParamsDto, @Body() body: updateCouponDto) {
    return await this.couponService.updateCoupon(user, param, body);
  }

  @Delete(':couponId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  async deleteCoupon(@User() user: UserDocument, @Param() param: couponParamsDto) {
    return await this.couponService.deleteCoupon(user, param);
  }

}
