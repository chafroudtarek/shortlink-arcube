import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IQueryParser } from 'src/v1/modules/shared/queryParser/queryParser.interface';
import { MONGO_QUERY_PARSER_PROVIDER_NAME } from '../providers.constants';
@Injectable()
export class QueryParserMiddleware implements NestMiddleware {
  constructor(
    @Inject(MONGO_QUERY_PARSER_PROVIDER_NAME) private readonly _queryParser: IQueryParser,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    req.queryObject = this._queryParser.parseQuery(decodeURIComponent(req.url.split('?', 2)[1]));
    next();
  }
}
