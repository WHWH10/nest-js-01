import { Module } from '@nestjs/common';
import { NstorageController } from './nstorage.controller';
import { NstorageService } from './nstorage.service';

@Module({
  controllers: [NstorageController],
  providers: [NstorageService]
})
export class NstorageModule {}
