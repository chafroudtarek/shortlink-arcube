import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './v1/modules/users/users.module';
import { AuthModule } from './v1/modules/auth/auth.module';
import { loggerProviders } from './v1/modules/core/logger/logger.providers';
import { DatabaseModule } from './v1/modules/database/database.module';
import { SharedModule } from './v1/modules/shared/shared.module';
import { AccountVerificationModule } from './v1/modules/accountVerification/accountVerification.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { UrlShortenerModule } from './v1/modules/urlShortener/url-shortener.module';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    SharedModule,
    AuthModule,
    UserModule,
    AccountVerificationModule,
    UrlShortenerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...loggerProviders],
  exports: [...loggerProviders],
})
export class AppModule {}
