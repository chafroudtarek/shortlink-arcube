import { Inject, Injectable } from '@nestjs/common';
import { ILogger } from './v1/modules/core/logger/logger.interface';
import { LOGGER_PROVIDER_NAME } from './v1/modules/core/providers.constants';

@Injectable()
export class AppService {
  constructor(@Inject(LOGGER_PROVIDER_NAME) private _logger: ILogger) {}
  getHello(): string {
    this._logger.debug('Hello', 'Testing Debug');
    this._logger.error('Error', 'Testing Error');
    this._logger.verbose('Verbose', 'Testing Verbose');
    this._logger.warn('Warn', 'Testing Warn');
    this._logger.log('LOG', 'Testing Log');
    return 'Hello World!';
  }
}
