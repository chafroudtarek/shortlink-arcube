import { Controller, Post, Get, Body, Param, Inject, Redirect, HttpStatus } from '@nestjs/common';
import { URL_SHORTENER_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { CreateUrlValidation } from '../validations/createUrl.validation';
import { ConfigService } from '@nestjs/config';
import { UrlShortenerService } from '../services/url-shortner.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('ShortUrls')
@Controller('/api/urls/')
export class UrlShortenerController {
  constructor(
    @Inject(URL_SHORTENER_SERVICE_PROVIDER_NAME)
    private readonly _urlShortenerService: UrlShortenerService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiBody({ type: CreateUrlValidation })
  @ApiResponse({
    status: 201,
    description: 'URL shortened successfully',
    schema: {
      properties: {
        originalUrl: { type: 'string' },
        shortUrl: { type: 'string' },
        shortCode: { type: 'string' },
      },
    },
  })
  @Post('shorten')
  async shortenUrl(@Body() createUrlDto: CreateUrlValidation) {
    const url = await this._urlShortenerService.createShortUrl(createUrlDto.originalUrl);
    const baseUrl = this.configService.get<string>('BASE_URL');

    return {
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/v1/api/urls/${url.shortCode}`,
      shortCode: url.shortCode,
    };
  }

  @Get(':shortCode')
  @Redirect()
  async redirectToOriginalUrl(@Param('shortCode') shortCode: string) {
    const url = await this._urlShortenerService.getOriginalUrl(shortCode);
    return {
      url: url.originalUrl,
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    };
  }
}
