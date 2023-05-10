import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as webPush from 'web-push';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Music World API')
    .setDescription('This is the official API of Music World')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);
  // webPush.setVapidDetails(
  //   'music_world@yourdomain.org',
  //   'publicKey',
  //   'privateKey',
  // );
  await app.listen(1110);
}
bootstrap();
