import { IQueryObject } from 'src/modules/Helpers/queryParser/queryParser.interface';
import { IUser } from 'src/modules/users/users.interface';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      queryObject: IQueryObject;
    }
    export interface User extends IUser {
      id: string;
    }
  }
}
