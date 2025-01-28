import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from '../url-shortner.service';
import { NotFoundException } from '@nestjs/common';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;

  const mockUrl = {
    originalUrl: 'https://example.com/long/url',
    shortCode: 'abc123',
    accessCount: 0,
    createdAt: new Date(),
  };

  const mockUrlRepository = {
    insert: jest.fn().mockImplementation((data) => {
      return { ...mockUrl, ...data };
    }),
    findOne: jest.fn().mockImplementation(({ filter }) => {
      if (filter.shortCode === mockUrl.shortCode) {
        return mockUrl;
      }
      return null;
    }),
    update: jest.fn().mockImplementation(() => {
      return { modifiedCount: 1 };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        ...loggerProviders,
        { provide: 'URLS_REPOSITORY', useValue: mockUrlRepository },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should create a short URL', async () => {
      const result = await service.createShortUrl('https://example.com/long/url');

      expect(result.originalUrl).toBe(mockUrl.originalUrl);
      expect(result.shortCode).toBeDefined();
    });

    it('should call repository insert method', async () => {
      await service.createShortUrl('https://example.com');
      expect(mockUrlRepository.insert).toHaveBeenCalled();
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL for valid short code', async () => {
      const result = await service.getOriginalUrl(mockUrl.shortCode);
      expect(result).toEqual(mockUrl);
    });

    it('should throw NotFoundException for invalid short code', async () => {
      await expect(service.getOriginalUrl('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should update access count and last accessed time', async () => {
      await service.getOriginalUrl(mockUrl.shortCode);
      expect(mockUrlRepository.update).toHaveBeenCalledWith(
        { filter: { shortCode: mockUrl.shortCode } },
        {
          $inc: { accessCount: 1 },
          $set: { lastAccessedAt: expect.any(Date) },
        },
      );
    });
  });
});
