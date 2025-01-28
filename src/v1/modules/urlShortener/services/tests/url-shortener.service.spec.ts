import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from '../url-shortner.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
      if (filter.originalUrl === mockUrl.originalUrl) {
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

    jest.clearAllMocks();
    mockedAxios.head.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShortUrl', () => {
    beforeEach(() => {
      // Default successful head request mock
      mockedAxios.head.mockResolvedValue({ status: 200 });
    });

    it('should create a short URL for valid and accessible URL', async () => {
      const result = await service.createShortUrl('https://example.com/long/url');

      expect(result.originalUrl).toBe(mockUrl.originalUrl);
      expect(result.shortCode).toBeDefined();
      expect(mockedAxios.head).toHaveBeenCalledWith(
        'https://example.com/long/url',
        expect.any(Object),
      );
    });

    it('should return existing URL if already shortened', async () => {
      const result = await service.createShortUrl(mockUrl.originalUrl);
      expect(result).toEqual(mockUrl);
      expect(mockUrlRepository.insert).not.toHaveBeenCalled();
    });

    it('should reject invalid URL format', async () => {
      await expect(service.createShortUrl('not-a-url')).rejects.toThrow(BadRequestException);
    });

    it('should reject inaccessible URL', async () => {
      mockedAxios.head.mockRejectedValue(new Error('Network error'));
      await expect(service.createShortUrl('https://invalid.example.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject URL that returns 404', async () => {
      mockedAxios.head.mockRejectedValue({ response: { status: 404 } });
      await expect(service.createShortUrl('https://example.com/not-found')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should accept URL that returns redirect status', async () => {
      mockedAxios.head.mockResolvedValue({ status: 301 });
      const result = await service.createShortUrl('https://example.com/redirect');
      expect(result).toBeDefined();
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
