import { AuthGuard } from '@nestjs/passport';

export class RefreshJwtGuard extends AuthGuard('RefreshJwtStrategy') {
  constructor() {
    super();
  }
}
export const RTJwtGuardProvider = [
  {
    provide: 'RefreshJwtGuard',
    useClass: RefreshJwtGuard,
  },
];
