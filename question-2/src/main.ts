import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configData } from './@core/infrastructure/config/core.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  }); // setup cors

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, })); // validate

  app.setGlobalPrefix('api'); // /api global prefix

  const config = new DocumentBuilder()
    .setTitle(configData.projectName)
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('WMT-BE-TEAM')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(configData.port);
  console.log(`✅ Server running on port http://localhost:${configData.port}`);
  console.log(`✅ Document Swagger running on port http://localhost:${configData.port}/docs`);
}
bootstrap();
