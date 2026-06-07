import { Brand, BrandDocument } from './../../Database/Models/brand.model';
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./repository.dp";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandRepositoryService extends DataBaseRepository<BrandDocument> {
    constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {
        super(brandModel);
    }
}

