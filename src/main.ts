import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // 유저들이 보낸 것을 우리가 원하는 실제 타입으로 변경해줌 
  }));


  await app.listen(await config.getPortConfig());
}
bootstrap();
