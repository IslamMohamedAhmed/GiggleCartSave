import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudMulterOptions } from 'src/common/Multer/cloudMulterServices';
import { FileValidationInterceptor } from 'src/common/file-validation/file-validation.interceptor';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { addSubcategoryDto } from './subcategoryDtos/addSubcategory.dto';
import { SubcategoryDocument } from 'src/Database/Models/subcategory.model';
import { SubcategoryParamsIdDto } from './subcategoryDtos/subcategoryParamsId.dto';
import { updateSubcategoryDto } from './subcategoryDtos/updateSubcategory.dto';
import { SubcategoryQueryDto } from './subcategoryDtos/subcategory.query.dto';
import { ISubcategory } from './subcategory.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
import { validationFileOptions } from 'src/common/file-validation/validation.file.options';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {
  }

  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileInterceptor('image', cloudMulterOptions(validationFileOptions.Image)), new FileValidationInterceptor())
  async createSubcategory(@User() user: UserDocument,
    @Body() body: addSubcategoryDto,
    @UploadedFile() file: Express.Multer.File)
    : Promise<{ message: string, subcategory: SubcategoryDocument }> {
    return await this.subcategoryService.createSubcategory(user, body, file);
  }
  @Post(':subcategoryId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileInterceptor('image', cloudMulterOptions(validationFileOptions.Image)))
  async updateSubcategory(@User() user: UserDocument,
    @Body() body: updateSubcategoryDto,
    @Param() params: SubcategoryParamsIdDto,
    @UploadedFile() file: Express.Multer.File)
    : Promise<{ message: string }> {
    return await this.subcategoryService.updateSubcategory(user, params.subcategoryId, body, file);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Get(':subcategoryId')
  async getSingleSubcategory(@Param() params: SubcategoryParamsIdDto): Promise<{ message: string, subcategory: SubcategoryDocument }> {
    const subcategory = await this.subcategoryService.findById(params.subcategoryId, [{ path: 'createdBy', select: 'name email _id' }
      , { path: 'categoryId', select: 'name _id' }
    ]);
    return { message: "Successfully fetched subcategory", subcategory };
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @Delete(':subcategoryId')
  async deleteSubcategory(@Param() params: SubcategoryParamsIdDto): Promise<{ message: string }> {
    await this.subcategoryService.deleteSubcategory(params);
    return { message: "Successfully deleted subcategory" };
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Get()
  async getAllSubcategories(@Query() query: SubcategoryQueryDto): Promise<{ message: string, subcategories: ISubcategory[] | IPaginate<ISubcategory> }> {
    const subcategories = await this.subcategoryService.findAll(query);
    return { message: "Successfully fetched subcategories", subcategories };
  }

}
