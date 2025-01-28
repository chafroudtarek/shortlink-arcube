import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class TransferFileStaticPathToBodyInterceptor implements NestInterceptor {
  private fieldName: string;
  private fileLocationType: string;
  constructor(fieldNameInBody: string, fileLocationType: string) {
    this.fieldName = fieldNameInBody;
    this.fileLocationType = fileLocationType;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.file) {
      request.body[this.fieldName] =
        process.env.SITE_URL + '/' + this.fileLocationType + '/' + request.file.filename;
    }
    return next.handle();
  }
}
