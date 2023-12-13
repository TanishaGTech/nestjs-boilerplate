import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // When transform is set to true, the ValidationPipe automatically transforms the incoming request payload (e.g., JSON body) into an instance of the DTO (Data Transfer Object) class specified in your route handler.

  // When whitelist is set to true, the ValidationPipe strips any properties from the incoming request payload that do not have corresponding properties in the DTO.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('sample-project')
    .setDescription('all apis')
    .setVersion('1.0')
    .addTag('example')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
        name: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis-nestjs', app, document);
  await app.listen(3000);
}
bootstrap();
