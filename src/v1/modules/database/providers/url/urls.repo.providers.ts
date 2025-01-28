import { URLS_REPO_PROVIDER_NAME } from '../../providers.constants';
import { UrlsRepository } from '../../repositories/url.repository';

export const urlsRepositoryProviders = [
  {
    provide: URLS_REPO_PROVIDER_NAME,
    useClass: UrlsRepository,
  },
];
