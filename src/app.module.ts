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
import { CartModule } from './Modules/cart/cart.module';
import { CouponModule } from './Modules/coupon/coupon.module';
import { ReviewModule } from './Modules/review/review.module';
import { OrderModule } from './Modules/order/order.module';
import { GatewayModule } from './Modules/gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './Config/.env.dev', isGlobal: true }),
    MongooseModule.forRoot(process.env.db_url ?? ""),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new KeyvRedis('redis://localhost:6379'),
          ],
        };
      },
      isGlobal: true,
    }),
    UserModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    SubcategoryModule,
    CartModule,
    CouponModule,
    ReviewModule,
    OrderModule,
    GlobalAuthenticationModuleTsModule,
    GatewayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
