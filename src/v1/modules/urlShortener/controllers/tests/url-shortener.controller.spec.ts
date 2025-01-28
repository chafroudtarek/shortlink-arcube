import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from '../url-shortener.controller';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';

describe('UrlShortenerController', () => {
  let controller: UrlShortenerController;

  const mockUrl = {
    originalUrl: 'https://example.com/long/url',
    shortCode: 'abc123',
    accessCount: 0,
    createdAt: new Date(),
  };

  const mockUrlShortenerService = {
    createShortUrl: jest.fn().mockImplementation((originalUrl) => {
      return { ...mockUrl, originalUrl };
    }),
    getOriginalUrl: jest.fn().mockImplementation((shortCode) => {
      if (shortCode === mockUrl.shortCode) {
        return mockUrl;
      }
      throw new Error('URL not found');
    }),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:6003'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [
        ...loggerProviders,
        { provide: 'URL_SHORTENER_SERVICE', useValue: mockUrlShortenerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<UrlShortenerController>(UrlShortenerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should create a short URL', async () => {
      const result = await controller.shortenUrl({
        originalUrl: 'https://example.com/long/url',
      });

      expect(result).toEqual({
        originalUrl: mockUrl.originalUrl,
        shortUrl: `http://localhost:6003/v1/urls/${mockUrl.shortCode}`,
        shortCode: mockUrl.shortCode,
      });
    });

    it('should call createShortUrl service method', async () => {
      await controller.shortenUrl({ originalUrl: 'https://example.com' });
      expect(mockUrlShortenerService.createShortUrl).toHaveBeenCalledWith('https://example.com');
    });
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to original URL', async () => {
      const result = await controller.redirectToOriginalUrl(mockUrl.shortCode);

      expect(result).toEqual({
        url: mockUrl.originalUrl,
        statusCode: HttpStatus.MOVED_PERMANENTLY,
      });
    });

    it('should throw error for invalid short code', async () => {
      await expect(controller.redirectToOriginalUrl('invalid')).rejects.toThrow('URL not found');
    });
  });
});
