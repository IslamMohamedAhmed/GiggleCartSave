import { cloudMulterOptions } from './../../common/Multer/cloudMulterServices';
import { Controller, Post, UploadedFile, UseInterceptors, Body, UsePipes, ValidationPipe, Param, Get, Query, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { addCategoryDto } from './categoryDtos/addCategory.dto';
import { CategoryDocument } from 'src/Database/Models/category.model';
import { FileValidationInterceptor } from 'src/common/file-validation/file-validation.interceptor';
import { updateCategoryDto } from './categoryDtos/updateCategory.dto';
import { categoryParamsIdDto } from './categoryDtos/categoryParamsId.dto';
import { CategoryQueryDto } from './categoryDtos/category.query.dto';
import { ICategory } from './category.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
import { validationFileOptions } from 'src/common/file-validation/validation.file.options';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileInterceptor('logo', cloudMulterOptions(validationFileOptions.Image)), new FileValidationInterceptor())
  async createCategory(@User() user: UserDocument,
    @Body() body: addCategoryDto,
    @UploadedFile() file: Express.Multer.File)
    : Promise<{ message: string, category: CategoryDocument }> {
    return await this.categoryService.createCategory(user, body, file);
  }
  @Post(':categoryId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileInterceptor('logo', cloudMulterOptions(validationFileOptions.Image)))
  async updateCategory(@User() user: UserDocument,
    @Body() body: updateCategoryDto,
    @Param() params: categoryParamsIdDto,
    @UploadedFile() file: Express.Multer.File)
    : Promise<{ message: string }> {
    console.log(params);

    return await this.categoryService.updateCategory(user, params.categoryId, body, file);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Get(':categoryId')
  async getSingleCategory(@Param() params: categoryParamsIdDto): Promise<{ message: string, category: CategoryDocument }> {
    const category = await this.categoryService.findById(params.categoryId, [{ path: 'createdBy', select: 'name email _id' }]);
    return { message: "Successfully fetched category", category };
  }


  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @Delete(':categoryId')
  async deleteCategory(@User() user: UserDocument, @Param() params: categoryParamsIdDto): Promise<{ message: string }> {
    await this.categoryService.deleteCategory(user, params);
    return { message: "Successfully deleted category" };
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Get()
  async getAllCategories(@Query() query: CategoryQueryDto): Promise<{ message: string, categories: ICategory[] | IPaginate<ICategory> }> {
    const categories = await this.categoryService.findAll(query);
    return { message: "Successfully fetched categories", categories };
  }


}
