import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_PROVIDER_NAME) private _logger: ILogger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    this._logger.error(exception.name, exception.message, exception?.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') {
      return response.status(exception.getStatus()).send({
        error: exception.name,
        message: exception.message,
        timestamp: Date.now(),
      });
    }
    return response.status(status).json({
      ...exceptionResponse,
      timestamp: Date.now(),
    });
  }
}
