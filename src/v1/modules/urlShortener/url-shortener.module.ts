import { Module } from '@nestjs/common';
import { UrlShortenerController } from './controllers/url-shortener.controller';
import { usersServiceProvider } from './providers/urlService.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UrlShortenerController],
  providers: [...usersServiceProvider],

  exports: [],
})
export class UrlShortenerModule {}
