import { IReview } from './review.interface';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { catchError } from 'rxjs';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { ReviewRepositoryService } from 'src/common/DP/reviewRepositoryService';
import { RoleTypes, UserDocument } from 'src/Database/Models/user.model';
import { AddReviewDto } from './reviewDtos/addReview.dto';
import { ReviewDocument } from 'src/Database/Models/review.model';
import { ReviewParamDto } from './reviewDtos/reviewParam.dto';
import { UpdateReviewDto } from './reviewDtos/updateReview.dto';
import { ReviewQueryDto } from './reviewDtos/review.query.dto';
import { IPaginate } from 'src/common/DP/repository.dp';

@Injectable()
export class ReviewService {
    constructor(
        private readonly productRepository: ProductRepositoryService,
        private readonly reviewRepository: ReviewRepositoryService
    ) { }


    async addReview(user: UserDocument, body: AddReviewDto): Promise<{ message: string, review: ReviewDocument }> {
        let reviewExist = await this.reviewRepository.findOne({ filter: { createdBy: user._id, product: body.productId } });
        if (reviewExist) {
            throw new ConflictException('you have already added a review for this product');
        }
        else {
            body['createdBy'] = user._id;
            let review = await this.reviewRepository.create(body);
            return { message: 'success', review };
        }
    }

    async getSingleReview(param: ReviewParamDto): Promise<{ message: string, review: ReviewDocument }> {
        let review = await this.reviewRepository.findOne({ filter: { _id: param.id } });
        if (!review) {
            throw new NotFoundException('review not found');
        }
        return { message: 'success', review };
    }

    async updateReview(user: UserDocument, body: UpdateReviewDto, param: ReviewParamDto): Promise<{ message: string }> {
        let review = await this.reviewRepository.findById({ id: param.id });
        if (!review) {
            throw new NotFoundException('review not found');
        }
        if (review.createdBy.equals(user._id)) {
            let review = await this.reviewRepository.updateOne({ filter: { _id: param.id }, data: body });
            return { message: 'success, review updated' };
        }
        else {

            throw new BadRequestException('you are not authorized to update that review');
        }

    }

    async deleteReview(user: UserDocument, param: ReviewParamDto): Promise<{ message: string }> {
        let review = await this.reviewRepository.findById({ id: param.id });
        if (!review) {
            throw new NotFoundException('review not found');
        }
        if (review.createdBy.equals(user._id) || user.role == RoleTypes.superadmin) {
            let deletedReview = await this.reviewRepository.deleteOne({ _id: param.id });
            return { message: 'success, review was deleted' };
        } else {
            throw new BadRequestException('you are not authorized to delete that review');
        }
    }

    async getAllReviews(query?: ReviewQueryDto): Promise<IReview[] | IPaginate<IReview>> {
        let filter: any = {};
        if (query?.text) {
            filter = {
                text: { $regex: query.text, $options: 'i' }

            }
        }

        if (query?.maxRating !== undefined) {
            filter.rating = { $lte: query.maxRating };
        }
        if (query?.minRating !== undefined) {
            filter.rating = { ...filter.rating, $gte: query.minRating };
        }


        if (query?.productId) {
            filter.productId = query.productId;
        }
        return await this.reviewRepository.find({
            filter, populate: query?.populate,
            select: query?.select, sort: query?.sort, page: query?.page, limit: query?.limit
        });

    }







}
