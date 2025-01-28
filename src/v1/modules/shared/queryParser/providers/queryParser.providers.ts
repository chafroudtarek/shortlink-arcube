import { MONGO_QUERY_PARSER_PROVIDER_NAME } from '../../providers.constants';
import { QueryParser } from '../queryParser.service';

export const queryParserProviders = [
  {
    provide: MONGO_QUERY_PARSER_PROVIDER_NAME,
    useClass: QueryParser,
  },
];
