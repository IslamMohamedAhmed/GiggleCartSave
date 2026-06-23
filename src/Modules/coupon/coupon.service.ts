import { IPaginate } from './../../common/DP/repository.dp';
import { ICoupon } from './coupon.interface';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CouponRepositoryService } from 'src/common/DP/couponRepositoryService';
import { AddCouponDto } from './couponDtos/addCoupon.dto';
import { UserDocument } from 'src/Database/Models/user.model';
import { CouponDocument } from 'src/Database/Models/coupon.model';
import { updateCouponDto } from './couponDtos/updateCoupon.dto';
import { couponParamsDto } from './couponDtos/couponParamsDto';
import { CouponQueryDto } from './couponDtos/coupon.query.dto';

@Injectable()
export class CouponService {
    constructor(private readonly couponRepository: CouponRepositoryService) { }


    async addCoupon(user: UserDocument, body: AddCouponDto): Promise<{ message: string, coupon: CouponDocument }> {
        body['createdBy'] = user._id;
        let couponExist = await this.couponRepository.findOne({ filter: { code: body.code } });
        if (couponExist) {
            throw new ConflictException('Coupon code already exists');
        }
        else {
            let coupon = await this.couponRepository.create(body);

            return { message: 'success', coupon };
        }
    }

    async getSingleCoupon(param: couponParamsDto): Promise<{ message: string, coupon: CouponDocument }> {
        let coupon = await this.couponRepository.findOne({ filter: { _id: param.couponId } });
        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }
        return { message: 'success', coupon };
    }

    async updateCoupon(user: UserDocument, param: couponParamsDto, body: updateCouponDto): Promise<{ message: string }> {
        let coupon = await this.couponRepository.findOne({ filter: { _id: param.couponId } });
        if (coupon && coupon.createdBy.toString() === user._id.toString()) {
            if (body.code) {
                let couponExist = await this.couponRepository.findOne({ filter: { code: body.code } });
                if (couponExist) {
                    throw new ConflictException('Coupon code must be unique!!');
                }
            }
            let updatedCoupon = await this.couponRepository.updateOne({ filter: { _id: param.couponId }, data: { ...body } });
            return { message: 'successfully updated coupon' };
        } else {
            throw new NotFoundException('You are not authorized to update that coupon');
        }
    }

    async deleteCoupon(user: UserDocument, param: couponParamsDto): Promise<{ message: string }> {
        let coupon = await this.couponRepository.findOne({ filter: { _id: param.couponId } });
        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }
        if (coupon.createdBy.toString() === user._id.toString()) {
            await this.couponRepository.deleteOne({ _id: param.couponId });
            return { message: 'successfully deleted coupon' };
        } else {
            throw new NotFoundException('You are not authorized to delete that coupon');
        }
    }


    async getAllCoupons(query: CouponQueryDto): Promise<ICoupon[] | IPaginate<ICoupon>> {
        let filter: any = {};
        if (query.code) {
            filter.code = { $regex: query.code, $options: 'i' };
        }
        if (query.minExpiringDate) {
            filter.expiresAt = { ...filter.expiresAt, $gte: new Date(query.minExpiringDate) };
        }
        if (query.maxExpiringDate) {
            filter.expiresAt = { ...filter.expiresAt, $lte: new Date(query.maxExpiringDate) };
        }
        if (query.minDiscount) {
            filter.discount = { ...filter.discount, $gte: query.minDiscount };
        }
        if (query.maxDiscount) {
            filter.discount = { ...filter.discount, $lte: query.maxDiscount };
        }
        return await this.couponRepository
            .find({ filter, populate: query?.populate, select: query?.select, sort: query?.sort, page: query?.page, limit: query?.limit });
    }



}
