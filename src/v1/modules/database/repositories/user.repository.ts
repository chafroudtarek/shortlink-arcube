import { Inject } from '@nestjs/common';
import { RolesRepository } from './role.repository';
import { ClientSession, Model, Types as MongooseTypes } from 'mongoose';
import { IUserModel } from '../models/user.model';
import { USERS_ORM_REPO_PROVIDER_NAME } from '../providers.constants';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
import { ICreateUserDto } from '../../users/dtos/createUserDto';
import { IUser, User } from '../../users/users.interface';
import { IQueryObject } from '../../shared/queryParser/queryParser.interface';
import { IBaseRepository } from 'src/types/baseRepository';

export class UsersRepository implements IUsersRepository {
  private _session: ClientSession = null;
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(USERS_ORM_REPO_PROVIDER_NAME)
    private readonly _ormRepo: Model<IUserModel>,
  ) {}
  setSession(sess: ClientSession) {
    this._session = sess;
  }
  async insert(payload: ICreateUserDto): Promise<Partial<IUser>> {
    const newUser = await this._ormRepo.create(payload);
    const result = await newUser.save();
    this._logger.debug('User Repo', JSON.stringify(result));
    return UsersRepository.toDomainUser(result);
  }
  async findOne<OutputEntity extends Partial<IUser>>(
    options: IQueryObject,
  ): Promise<OutputEntity | null> {
    const result = await this._ormRepo
      .findOne(options.filter)
      .populate(options.populate)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .exec();
    if (result === null) {
      return null;
    }
    const data = UsersRepository.toDomainUser(result);
    return data as OutputEntity;
  }
  async findOneById<OutputEntity extends Partial<IUser>>(id: string): Promise<OutputEntity> {
    const result = await this._ormRepo.findOne({
      _id: id,
    });
    if (result === null) {
      return null;
    }
    const data = UsersRepository.toDomainUser(result);
    return data as OutputEntity;
  }
  async update(options: IQueryObject, updatePayload: any): Promise<number> {
    const result = await this._ormRepo.updateOne(options.filter, updatePayload);
    return result.modifiedCount;
  }
  async softDelete(options: IQueryObject): Promise<number> {
    const result = await this._ormRepo.updateMany(options.filter, {
      deletedAt: new Date(),
    });
    return result.modifiedCount;
  }
  async findMany<OutputEntity extends Partial<IUser>>(
    options: IQueryObject,
  ): Promise<Array<OutputEntity>> {
    const result = await this._ormRepo
      .find(options.filter)
      .populate(options.populate)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .exec();
    const data = UsersRepository.toDomainUsers(result);
    this._logger.debug('users repo', data);
    return data as Array<OutputEntity>;
  }
  async count(): Promise<number> {
    return await this._ormRepo.count();
  }
  async doesUserHavePermission(userId: string, permissions: string[]): Promise<boolean> {
    const result = await this._ormRepo.aggregate([
      { $match: { _id: new MongooseTypes.ObjectId(userId) } },
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'roles.permissions',
          foreignField: '_id',
          as: 'permissions',
        },
      },
      { $match: { 'permissions.name': { $in: permissions } } },
      {
        $addFields: {
          permissions: {
            $filter: {
              input: '$permissions',
              as: 'permission',
              cond: { $in: ['$$permission.name', permissions] },
            },
          },
        },
      },
    ]);
    return result.length > 0 && permissions.length === result[0].permissions.length;
  }
  async getUserPassword(id: string): Promise<string> {
    const result = await this._ormRepo.findOne({
      _id: id,
    });
    return result?.password || null;
  }
  static toDomainUsers(data: Array<IUserModel>): Partial<IUser>[] {
    return data.map((item) => this.toDomainUser(item));
  }
  static toDomainUser(data: IUserModel): Partial<IUser> {
    const user = new User();
    user.id = data._id.toString();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.username = data.username;
    user.email = data.email;
    user.isVerified = data.isVerified;
    user.birthDate = data.birthDate;
    user.age = data.age;
    user.roles = data?.roles ? RolesRepository.toDomainRoles(data?.roles) : [];
    return user;
  }
}

export interface IUsersRepository extends IBaseRepository<ICreateUserDto, IUser> {
  getUserPassword(id: string): Promise<string>;
  doesUserHavePermission(userId: string, permissionName: string[]): Promise<boolean>;
}
