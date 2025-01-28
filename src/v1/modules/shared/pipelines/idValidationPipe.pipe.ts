import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValidId = value !== undefined && value !== null;

    if (!isValidId) {
      throw new BadRequestException('Invalid ID parameter.');
    }

    return value;
  }
}
