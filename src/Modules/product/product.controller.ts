import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { cloudMulterOptions } from 'src/common/Multer/cloudMulterServices';
import { FileValidationInterceptor } from 'src/common/file-validation/file-validation.interceptor';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { CreateProductDTO } from './productDtos/addProduct.dto';
import { ProductDocument } from 'src/Database/Models/product.model';
import { productIdDto, updateProductDto } from './productDtos/updateAndDeleteProduct.dto';
import { validationFileOptions } from 'src/common/file-validation/validation.file.options';
import { ProductQueryDto } from './productDtos/product.query.dto';
import { IPaginate } from 'src/common/DP/repository.dp';
import { IProduct } from './product.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @Post()
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
  ], cloudMulterOptions(validationFileOptions.Image)), new FileValidationInterceptor('image'))
  async createProduct(@User() user: UserDocument,
    @Body() body: CreateProductDTO,
    @UploadedFiles() files: { image: Express.Multer.File[], gallery?: Express.Multer.File[] })
    : Promise<{ message: string, product: ProductDocument }> {
    return await this.productService.createProduct(user, body, files);

  }
  @Patch(':productId')
  @Auth([RoleTypes.admin, RoleTypes.superadmin])
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
  ], cloudMulterOptions(validationFileOptions.Image)))
  async updateProduct(@User() user: UserDocument,
    @Body() body: updateProductDto,
    @Param() param: productIdDto,
    @UploadedFiles() files?: { image?: Express.Multer.File[], gallery?: Express.Multer.File[] })
    : Promise<{ message: string }> {
    return await this.productService.updateProduct(user, body, param.productId, files);

  }

  @Get()
  async findAll(@Query() query: ProductQueryDto): Promise<IProduct[] | IPaginate<IProduct>> {
    return await this.productService.findAll(query);
  }
}
