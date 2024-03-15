import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { TransformInterceptor } from './intercepters/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(
  //   cors({
  //     origin: 'http://localhost:3000',
  //     credentials: true,
  //   }),
  // );
  // app.use(cors());
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(5050);
}
bootstrap();
