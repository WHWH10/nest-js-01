import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { HeartrateModule } from './heartrate/heartrate.module';

@Module({
  controllers: [ApiController],
  imports: [HeartrateModule]
})
export class ApiModule {}
