import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { latency } from './developement.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(latency)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
