import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudMulterOptions } from 'src/common/Multer/cloudMulterServices';
import { FileValidationInterceptor } from 'src/common/file-validation/file-validation.interceptor';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { addBrandDto } from './brandDtos/addBrand.dto';
import { BrandDocument } from 'src/Database/Models/brand.model';
import { updateBrandDto } from './brandDtos/updateBrand.dto';
import { brandParamsIdDto } from './brandDtos/brandParamsId.dto';
import { BrandQueryDto } from './brandDtos/brand.query.dto';
import { IBrand } from './brand.interface';
import { IPaginate } from 'src/common/DP/repository.dp';
import { validationFileOptions } from 'src/common/file-validation/validation.file.options';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileInterceptor('logo', cloudMulterOptions(validationFileOptions.Image)), new FileValidationInterceptor())
  async createBrand(@User() user: UserDocument,
    @Body() body: addBrandDto,
    @UploadedFile() file: Express.Multer.File)
    : Promise<{ message: string, brand: BrandDocument }> {
    return await this.brandService.createBrand(user, body, file);
  }
  @Post(':brandId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileInterceptor('logo', cloudMulterOptions(validationFileOptions.Image)))
  async updateBrand(@User() user: UserDocument,
    @Body() body: updateBrandDto,
    @Param() params: brandParamsIdDto,
    @UploadedFile() file: Express.Multer.File)
    : Promise<{ message: string }> {
    return await this.brandService.updateBrand(user, params.brandId, body, file);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Get(':brandId')
  async getSingleBrand(@Param() params: brandParamsIdDto): Promise<{ message: string, brand: BrandDocument }> {
    const brand = await this.brandService.findById(params.brandId, [{ path: 'createdBy', select: 'name email _id' }]);
    return { message: "Successfully fetched brand", brand };
  }


  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @Delete(':brandId')
  async deleteBrand(@Param() params: brandParamsIdDto): Promise<{ message: string }> {
    await this.brandService.deleteBrand(params);
    return { message: "Successfully deleted brand" };
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @Get()
  async getAllBrands(@Query() query: BrandQueryDto): Promise<{ message: string, brands: IBrand[] | IPaginate<IBrand> }> {
    const brands = await this.brandService.findAll(query);
    return { message: "Successfully fetched brands", brands };
  }

}
