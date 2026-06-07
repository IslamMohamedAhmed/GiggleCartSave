import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './Modules/product/product.module';
import { CategoryModule } from './Modules/category/category.module';
import { BrandModule } from './Modules/brand/brand.module';
import { SubcategoryModule } from './Modules/subcategory/subcategory.module';
import { GlobalAuthenticationModuleTsModule } from './common/modules/global.authentication.module.ts/global.authentication.module.ts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './Config/.env.dev', isGlobal: true }),
    MongooseModule.forRoot(process.env.db_url ?? ""),
    UserModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    SubcategoryModule,
    GlobalAuthenticationModuleTsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
