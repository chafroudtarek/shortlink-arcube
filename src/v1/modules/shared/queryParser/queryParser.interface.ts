export interface IQueryParser {
  parseQuery(str: string): IQueryObject;
}

export interface IQueryObject {
  filter?: any;
  populate?: any;
  select?: any;
  skip?: number;
  limit?: number;
  sort?: any;
}
