import { URL_SHORTENER_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { UrlShortenerService } from '../services/url-shortner.service';

export const usersServiceProvider = [
  {
    provide: URL_SHORTENER_SERVICE_PROVIDER_NAME,
    useClass: UrlShortenerService,
  },
];
