import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { UserModule } from '../user/user.module';
import { BrandModel } from 'src/Database/Models/brand.model';
import { CloudService } from 'src/common/Services/cloudService';
import { BrandRepositoryService } from 'src/common/DP/brandRepositoryService';

@Module({
  imports: [UserModule, BrandModel],
  controllers: [BrandController],
  providers: [BrandService, CloudService, BrandRepositoryService],
})
export class BrandModule { }
