import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvEnum } from '@sdk/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI, prefix: 'v', defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: false }));
  app.enableCors();

  const { NODE_ENV, SERVICE_NAME, SERVICE_PORT, SERVICE_HOST } = process.env;

  if (NODE_ENV !== EnvEnum.production) {
    const documentBuilder = new DocumentBuilder()
      .setTitle(SERVICE_NAME || 'unknown')
      .setDescription(`${SERVICE_NAME} description`)
      .addBearerAuth()
      .setVersion('v1');

    const config = documentBuilder.build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, { customSiteTitle: `${SERVICE_NAME} - OpenAPI` });
  }

  await app.listen(SERVICE_PORT || 3000, SERVICE_HOST || '0.0.0.0');
}
bootstrap();
