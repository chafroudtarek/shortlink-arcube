import { Module } from '@nestjs/common';
import { VerifyAccountByEmailController } from './controllers/verifyAccountByEmail.controller';
import { usersServiceProvider } from '../users/providers/usersService.providers';
import { accountEmailVerificationServiceProviders } from './providers/accountEmailVerification.service.providers';
import { requestEmailVerificationServiceProviders } from './providers/requestEmailVerification.service.providers';
import { RequestAccountEmailVerificationController } from './controllers/requestAccountEmailVerification.controller';
import { UserNotVerifiedAccessJwtStrategy } from './strategies/jwtAuthUserNotVerified.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/v1/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secretKey,
      signOptions: { expiresIn: JWT_CONFIG.accessExpiresIn },
    }),
  ],
  controllers: [VerifyAccountByEmailController, RequestAccountEmailVerificationController],
  providers: [
    UserNotVerifiedAccessJwtStrategy,
    ...accountEmailVerificationServiceProviders,
    ...requestEmailVerificationServiceProviders,
    ...usersServiceProvider,
  ],
  exports: [],
})
export class AccountVerificationModule {}
