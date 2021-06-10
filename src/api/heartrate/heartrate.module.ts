import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/config/config.module';
import { HeartRateRepository } from 'src/repository/heart-rate.repository';
import { HeartRateSchema } from 'src/schema/heart-rate.schema';
import { HeartrateController } from './heartrate.controller';
import { HeartrateService } from './heartrate.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'HeartRate', schema: HeartRateSchema }]), ConfigModule],
    controllers: [HeartrateController],
    providers: [HeartrateService, HeartRateRepository],
    exports: [HeartrateService, HeartRateRepository]
})
export class HeartrateModule { }
