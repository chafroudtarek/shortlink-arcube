import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPO_PROVIDER_NAME } from '../../database/providers.constants';
import { IUsersRepository } from '../../database/repositories/user.repository';
import { PAGINATOR_PROVIDER_NAME } from '../../shared/providers.constants';
import { Paginator } from '../../shared/paginator/paginator.service';
import { IUser } from '../users.interface';
import { ICreateUserDto } from '../dtos/createUserDto';
import { IQueryObject } from '../../shared/queryParser/queryParser.interface';
import { IPaginationReturn } from '../../shared/paginator/paginator.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USERS_REPO_PROVIDER_NAME)
    public _usersRepository: IUsersRepository,
    @Inject(PAGINATOR_PROVIDER_NAME) private _paginator: Paginator,
  ) {}
  async findOne(username: string): Promise<IUser | undefined> {
    return this._usersRepository.findOne({
      filter: { username: username },
    });
  }
  async findOneUserById(id: string): Promise<IUser> {
    const user = await this._usersRepository.findOne<IUser>({
      filter: { _id: id },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }
  async createUser(payload: ICreateUserDto): Promise<IUser | Partial<IUser>> {
    return await this._usersRepository.insert({
      ...payload,
      fullName: payload.firstName + ' ' + payload.lastName,
    });
  }
  async getOne(filter: IQueryObject): Promise<IUser | Partial<IUser>> {
    const result = await this._usersRepository.findOne<IUser>(filter);
    return result;
  }
  async softDeleteOne(filter: IQueryObject): Promise<number> {
    const result = await this._usersRepository.softDelete(filter);
    return result;
  }
  async update(filter: IQueryObject, payload: Partial<IUser>) {
    const result = await this._usersRepository.update(filter, payload);
    return result;
  }
  async getAll(filter: IQueryObject): Promise<IPaginationReturn<Array<IUser>>> {
    const countResult = await this._usersRepository.count({ filter: { deletedAt: { $eq: null } } });
    const findResult = await this._usersRepository.findMany(filter);
    const result = await this._paginator.paginateQuery(countResult, findResult, {
      skip: filter.skip,
      limit: filter.limit,
    });
    return result;
  }
}

export interface IUsersService {
  findOne(username: string): Promise<IUser | undefined>;
  findOneUserById(id: string): Promise<IUser>;
  createUser(payload: ICreateUserDto): Promise<IUser | Partial<IUser>>;
  getAll(filter: IQueryObject): Promise<IPaginationReturn<IUser[]>>;
  update(filter: IQueryObject, payload: Partial<IUser>): Promise<number>;
  getOne(filter: IQueryObject): Promise<IUser | Partial<IUser>>;
  softDeleteOne(filter: IQueryObject): Promise<number>;
}
