import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModel } from 'src/Database/Models/category.model';
import { UserModule } from '../user/user.module';
import { CloudService } from 'src/common/Services/cloudService';
import { CategoryRepositoryService } from '../../common/DP/categoryRepositoryService';

@Module({
  imports: [CategoryModel, UserModule],
  controllers: [CategoryController],
  providers: [CategoryService, CloudService, CategoryRepositoryService],
})
export class CategoryModule { }
