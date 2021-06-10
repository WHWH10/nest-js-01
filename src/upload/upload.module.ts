import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/config/config.module';
import { HeartRateRepository } from 'src/repository/heart-rate.repository';
import { HeartRateSchema } from 'src/schema/heart-rate.schema';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'HeartRate', schema: HeartRateSchema }]), ConfigModule],
  controllers: [UploadController],
  providers: [UploadService, HeartRateRepository],
  exports: [UploadService, HeartRateRepository]
})
export class UploadModule { }
