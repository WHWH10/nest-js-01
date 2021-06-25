import { Module } from '@nestjs/common';
import { MatlabController } from './matlab.controller';
import { MatlabService } from './matlab.service';
import { FmriModule } from './fmri/fmri.module';
import { EdfModule } from './edf/edf.module';

@Module({
  controllers: [MatlabController],
  providers: [MatlabService],
  imports: [FmriModule, EdfModule]
})
export class MatlabModule {}
