import { LOGGER_PROVIDER_NAME } from '../providers.constants';
import { LoggerService } from './logger.service';

export const loggerProviders = [
  {
    provide: LOGGER_PROVIDER_NAME,
    useClass: LoggerService,
  },
];
