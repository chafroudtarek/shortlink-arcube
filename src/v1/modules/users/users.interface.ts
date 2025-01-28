import { IRole } from '../auth/roles/roles.interface';
import * as bcrypt from 'bcryptjs';
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  birthDate: Date;
  email: string;
  password?: string;
  isVerified: boolean;
  age: number;
  roles: IRole[];
  isCorrectPassword(enteredPassword: string, currentPassword: string): Promise<boolean>;
}

export class User implements IUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: Date;
  email: string;
  isVerified: boolean;
  username: string;
  age: number;
  roles: IRole[];
  static async isCorrectPassword(enteredPassword: string, currentPassword: string) {
    return await bcrypt.compare(enteredPassword, currentPassword);
  }
  async isCorrectPassword(enteredPassword: string, currentPassword: string) {
    return await bcrypt.compare(enteredPassword, currentPassword);
  }
}

export interface IUserProfile extends Partial<IUser> {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  birthDate: Date;
  email: string;
  age: number;
}
export interface IRequestUser {
  id: string;
  isVerified: boolean;
}
