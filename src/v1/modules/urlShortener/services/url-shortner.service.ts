// src/v1/modules/urlShortener/services/url-shortener.service.ts
import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as shortid from 'shortid';
import { IUrlsRepository } from '../../database/repositories/url.repository';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
import { IUrl } from '../url.interface';
import { URLS_REPO_PROVIDER_NAME } from '../../database/providers.constants';
import axios from 'axios';
import { isURL } from 'class-validator';

@Injectable()
export class UrlShortenerService {
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(URLS_REPO_PROVIDER_NAME)
    private readonly _urlRepository: IUrlsRepository,
  ) {}

  private async verifyUrl(url: string): Promise<void> {
    if (
      !isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
      })
    ) {
      throw new BadRequestException('Invalid URL format');
    }

    try {
      // Check if URL is accessible
      const response = await axios.head(url, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
      });

      this._logger.debug(
        'UrlShortenerService',
        `URL verification successful: ${url} - Status: ${response.status}`,
      );
    } catch (error) {
      this._logger.error(
        'UrlShortenerService',
        `URL verification failed: ${url} - ${error.message}`,
      );
      throw new BadRequestException('URL is not accessible or invalid');
    }
  }

  async createShortUrl(originalUrl: string): Promise<Partial<IUrl> | IUrl> {
    this._logger.debug('UrlShortenerService', 'Starting createShortUrl...');

    // Verify URL before proceeding
    await this.verifyUrl(originalUrl);

    const existingUrl = await this._urlRepository.findOne({
      filter: { originalUrl, deletedAt: { $exists: false } },
    });

    if (existingUrl) {
      this._logger.debug(
        'UrlShortenerService',
        'URL already exists, returning existing short code',
      );
      return existingUrl;
    }

    const shortCode = shortid.generate();
    const url = await this._urlRepository.insert({
      originalUrl,
      shortCode,
      createdAt: new Date(),
      accessCount: 0,
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
