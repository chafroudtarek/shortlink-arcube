import { Global, Module } from '@nestjs/common';
import { exceptionsServiceProviders } from './exceptions/exceptionsService.providers';
import { loggerProviders } from './logger/logger.providers';

@Global()
@Module({
  providers: [...loggerProviders, ...exceptionsServiceProviders],
  exports: [...loggerProviders, ...exceptionsServiceProviders],
})
export class CoreModule {}
