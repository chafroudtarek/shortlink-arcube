import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { DATABASE_CONFIG } from 'src/v1/config';
import * as dbEntityEquivalents from 'src/v1/config/dbEntitiesEquivalents.json';
@Injectable()
@Catch(Error)
export class MongoDbExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const next = ctx.getNext<NextFunction>();
    if (exception.name === 'MongoServerError') {
      if (exception instanceof MongooseError.ValidationError) {
        // Validation error (e.g., missing required fields)
        next({ statusCode: 400, error: 'Validation error', message: exception.message });
      } else if (exception instanceof MongoError) {
        // handle duplicate key error
        if (exception.code === 11000) {
          const entity = exception.message
            .split(DATABASE_CONFIG.DATABASE_NAME + '.')[1]
            .split(' ')[0];
          next(
            new BadRequestException({
              statusCode: 409,
              error: 'Duplicate key',
              message: `${dbEntityEquivalents[entity]} Already Exists`,
            }),
          );
        }
      }
    }
  }
}
