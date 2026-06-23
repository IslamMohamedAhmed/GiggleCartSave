import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { AddReviewDto } from './reviewDtos/addReview.dto';
import { ReviewParamDto } from './reviewDtos/reviewParam.dto';
import { ReviewDocument } from 'src/Database/Models/review.model';
import { UpdateReviewDto } from './reviewDtos/updateReview.dto';
import { ReviewQueryDto } from './reviewDtos/review.query.dto';
import { IReview } from './review.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin, RoleTypes.user])
  async addReview(@User() user: UserDocument, @Body() body: AddReviewDto): Promise<{ message: string, review: ReviewDocument }> {
    return this.reviewService.addReview(user, body);
  }

  @Get(':id')
  async getSingleReview(@Param() Param: ReviewParamDto): Promise<{ message: string, review: ReviewDocument }> {
    return this.reviewService.getSingleReview(Param);
  }

  @Put(':id')
  @Auth([RoleTypes.admin, RoleTypes.superadmin, RoleTypes.user])
  async updateReview(@User() user: UserDocument, @Body() body: UpdateReviewDto, @Param() param: ReviewParamDto): Promise<{ message: string }> {
    return this.reviewService.updateReview(user, body, param);
  }

  @Delete(':id')
  @Auth([RoleTypes.admin, RoleTypes.superadmin, RoleTypes.user])
  async deleteReview(@User() user: UserDocument, @Param() param: ReviewParamDto): Promise<{ message: string }> {
    return this.reviewService.deleteReview(user, param);
  }

  @Get()
  async getAllReviews(@Query() query: ReviewQueryDto): Promise<IReview[] | IPaginate<IReview>> {
    return this.reviewService.getAllReviews(query);
  }

}
