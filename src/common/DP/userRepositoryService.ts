import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/Database/Models/user.model";
import { DataBaseRepository } from "src/common/DP/repository.dp";

@Injectable()
export class UserRepositoryService extends DataBaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
        super(userModel);
    }

    async checkEmailExists(data: any): Promise<null> {
        const user = await this.findOne({ filter: data });
        if (user) throw new ConflictException("Email already exists");
        return null;
    }
}

