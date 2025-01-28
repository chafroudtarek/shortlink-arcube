// src/v1/modules/urlShortener/services/url-shortener.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as shortid from 'shortid';
import { IUrlsRepository } from '../../database/repositories/url.repository';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
import { IUrl } from '../url.interface';
import { URLS_REPO_PROVIDER_NAME } from '../../database/providers.constants';

@Injectable()
export class UrlShortenerService {
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(URLS_REPO_PROVIDER_NAME)
    private readonly _urlRepository: IUrlsRepository,
  ) {}

  async createShortUrl(originalUrl: string): Promise<Partial<IUrl> | IUrl> {
    this._logger.debug('UrlShortenerService', 'Starting createShortUrl...');

    const shortCode = shortid.generate();
    const url = await this._urlRepository.insert({
      originalUrl,
      shortCode,
    });

    return url;
  }

  async getOriginalUrl(shortCode: string): Promise<Partial<IUrl> | IUrl> {
    this._logger.debug('UrlShortenerService', 'Starting getOriginalUrl...');

    const url = await this._urlRepository.findOne({
      filter: { shortCode, deletedAt: { $exists: false } },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this._urlRepository.update(
      { filter: { shortCode } },
      {
        $inc: { accessCount: 1 },
        $set: { lastAccessedAt: new Date() },
      },
    );

    return url;
  }
}
