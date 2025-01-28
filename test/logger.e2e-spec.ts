import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { LoggerService } from 'src/v1/modules/core/logger/logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: Logger, // Ensure to provide Logger
          useValue: new Logger(),
        },
      ],
    }).compile();

    loggerService = moduleRef.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
  });
});
