import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { APP_CONFIG } from './v1/config';
import * as cookieParser from 'cookie-parser';
import { UnprocessableEntityException, ValidationPipe, VersioningType } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './v1/modules/core/interceptors/logger.interceptor';
import { LoggerService } from './v1/modules/core/logger/logger.service';
import { HttpExceptionFilter } from './v1/modules/shared/exceptionFilters/httpExceptions.filter';
import { MongoDbExceptionsFilter } from './v1/modules/shared/exceptionFilters/mongoExceptions.filter';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.use(cookieParser());
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalFilters(new MongoDbExceptionsFilter(), new HttpExceptionFilter(new LoggerService()));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = {};
        errors.forEach((error) => {
          validationErrors[error.property] = Object.values(error.constraints)[0];
        });
        return new UnprocessableEntityException({
          message: validationErrors[Object.keys(validationErrors)[0]],
          statusCode: 400,
          validationErrors,
        });
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Arcube')
    .setDescription(`Arcube's Api Docs`)
    .setVersion('0.1')
    .addBearerAuth(
      {
        name: 'JWT',
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT Token',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(APP_CONFIG.PORT, '0.0.0.0');
}
bootstrap();
