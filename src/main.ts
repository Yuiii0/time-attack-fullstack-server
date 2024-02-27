import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
    //     app.useGlobalInterceptors(new TransformInterceptor());
    // app.useGlobalFilters(new HttpExceptionFilter());
  );
  await app.listen(5050);
}
bootstrap();
