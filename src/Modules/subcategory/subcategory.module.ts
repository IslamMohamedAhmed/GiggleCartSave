import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { CloudService } from 'src/common/Services/cloudService';
import { SubcategoryRepositoryService } from 'src/common/DP/subcategoryRepositoryService';
import { SubcategoryModel } from 'src/Database/Models/subcategory.model';
import { CategoryRepositoryService } from 'src/common/DP/categoryRepositoryService';
import { CategoryModel } from 'src/Database/Models/category.model';

@Module({
  imports: [SubcategoryModel, CategoryModel],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, CloudService, SubcategoryRepositoryService, CategoryRepositoryService],
})
export class SubcategoryModule { }
