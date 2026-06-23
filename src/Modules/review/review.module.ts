import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepositoryService } from 'src/common/DP/reviewRepositoryService';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { ProductModel } from 'src/Database/Models/product.model';
import { ReviewModel } from 'src/Database/Models/review.model';

@Module({
  imports: [ProductModel, ReviewModel],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepositoryService, ProductRepositoryService],
})
export class ReviewModule {}
