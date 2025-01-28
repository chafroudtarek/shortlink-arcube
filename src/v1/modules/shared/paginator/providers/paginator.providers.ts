import { PAGINATOR_PROVIDER_NAME } from '../../providers.constants';
import { Paginator } from '../paginator.service';

export const paginatorProviders = [
  {
    provide: PAGINATOR_PROVIDER_NAME,
    useClass: Paginator,
  },
];
