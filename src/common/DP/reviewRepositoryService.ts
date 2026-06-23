import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { InjectModel } from "@nestjs/mongoose";
import { Review, ReviewDocument } from "src/Database/Models/review.model";
import { Model } from "mongoose";




@Injectable()
export class ReviewRepositoryService extends DataBaseRepository<ReviewDocument> {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {
        super(reviewModel);
    }
}




