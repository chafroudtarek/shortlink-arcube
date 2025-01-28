import { Connection } from 'mongoose';
import { URL_ORM_REPOSITORY_PROVIDER_NAME } from '../../providers.constants';
import { urlSchema } from '../../models/url.model';

export const urlsMongooseRepoProviders = [
  {
    provide: URL_ORM_REPOSITORY_PROVIDER_NAME,
    useFactory: (connection: Connection) => {
      return connection.model('urls', urlSchema);
    },
    inject: ['DATA_SOURCE'],
  },
];
