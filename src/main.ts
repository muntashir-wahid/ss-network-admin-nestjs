import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Environment PORT:', process.env.PORT);
  app.setGlobalPrefix('/api/v1/');

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
