import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8086, () => {
    Logger.log('Visualization Service is running on port 8086!');
  });
}
bootstrap();
