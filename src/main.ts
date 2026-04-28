import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/config/environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const port = configService.get<number>('PORT');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bespoke API')
    .setDescription('API documentation for Bespoke project')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'deepSpace',
    }),
  );

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}/docs`);
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap application', error);
  process.exit(1);
});
