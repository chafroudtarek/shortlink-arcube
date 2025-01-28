import { UNIT_OF_WORK_PROVIDER_NAME } from '../../providers.constants';
import { UnitOfWork } from './unitOfWork.service';

export const unitOfWorkProviders = [
  {
    useClass: UnitOfWork,
    provide: UNIT_OF_WORK_PROVIDER_NAME,
  },
];
