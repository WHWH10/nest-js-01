import { Module } from '@nestjs/common';
import { MatlabController } from './matlab.controller';
import { MatlabService } from './matlab.service';

@Module({
  controllers: [MatlabController],
  providers: [MatlabService]
})
export class MatlabModule {}
