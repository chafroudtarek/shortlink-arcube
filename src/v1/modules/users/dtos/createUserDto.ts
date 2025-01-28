export interface ICreateUserDto {
  firstName: string;
  lastName: string;
  fullName?: string;
  birthDate?: Date;
  email: string;
  password: string;
  verify_password: string;
  username: string;
  picture?: string;
}
