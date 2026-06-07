import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModule } from '../user/user.module';
import { ProductModel } from 'src/Database/Models/product.model';
import { CategoryModel } from 'src/Database/Models/category.model';
import { BrandModel } from 'src/Database/Models/brand.model';
import { SubcategoryModel } from 'src/Database/Models/subcategory.model';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { CategoryRepositoryService } from 'src/common/DP/categoryRepositoryService';
import { BrandRepositoryService } from 'src/common/DP/brandRepositoryService';
import { SubcategoryRepositoryService } from 'src/common/DP/subcategoryRepositoryService';
import { CloudService } from 'src/common/Services/cloudService';

@Module({
  imports: [UserModule, ProductModel, CategoryModel, BrandModel, SubcategoryModel],
  controllers: [ProductController],
  providers: [ProductService,
    ProductRepositoryService,
    CategoryRepositoryService,
    BrandRepositoryService,
    SubcategoryRepositoryService, CloudService],
})
export class ProductModule { }
