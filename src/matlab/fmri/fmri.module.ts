import { Module } from '@nestjs/common';
import { FmriController } from './fmri.controller';
import { FmriService } from './fmri.service';

@Module({
  controllers: [FmriController],
  providers: [FmriService],
  exports: [FmriService]
})
export class FmriModule { }
