import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UploadModule } from './upload/upload.module';
import { NstorageModule } from './nstorage/nstorage.module';

@Module({
  imports: [ConfigModule, UploadModule, NstorageModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
