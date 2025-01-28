import { MongooseQueryParser } from 'mongoose-query-parser';
import { IQueryObject, IQueryParser } from './queryParser.interface';

export class QueryParser extends MongooseQueryParser implements IQueryParser {
  parseQuery(str: string, includeDeleted = false) {
    const mongooseQueryParser = new MongooseQueryParser();
    const result = mongooseQueryParser.parse(str) as IQueryObject;
    delete result.filter.undefined;
    if (!includeDeleted) {
      result.filter.deletedAt = null;
    }
    if (!result.skip) {
      result.skip = 0;
    }
    if (!result.limit) {
      result.limit = 100;
    }
    return result;
  }
}
