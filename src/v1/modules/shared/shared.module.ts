import { Global, Module } from '@nestjs/common';
import { queryParserProviders } from './queryParser/providers/queryParser.providers';
import { paginatorProviders } from './paginator/providers/paginator.providers';
import { loggerProviders } from '../core/logger/logger.providers';
// import { MailingModule } from './mailing/mailing.module';
import { hashingServiceProviders } from './hashing/providers/hashingService.providers';

@Global()
@Module({
  // imports: [MailingModule],
  providers: [
    ...loggerProviders,
    ...queryParserProviders,
    ...paginatorProviders,
    ...hashingServiceProviders,
  ],
  exports: [
    ...loggerProviders,
    ...paginatorProviders,
    ...queryParserProviders,
    ...hashingServiceProviders,
    // MailingModule,
  ],
})
export class SharedModule {}
