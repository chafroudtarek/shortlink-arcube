import { ClientSession, Model } from 'mongoose';
import { ICreateRoleDto } from '../../auth/roles/dtos/createRoleDto';
import { ROLES_ORM_REPO_PROVIDER_NAME } from '../providers.constants';
import { IRoleModel } from '../models/role.model';
import { ILogger } from '../../core/logger/logger.interface';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { Inject } from '@nestjs/common';
import { IRole, Role } from '../../auth/roles/roles.interface';
import { IQueryObject } from '../../shared/queryParser/queryParser.interface';
import { PermissionsRepository } from './permissions.repository';
import { IBaseRepository } from 'src/types/baseRepository';

export class RolesRepository implements IRolesRepository {
  private _session: ClientSession = null;
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(ROLES_ORM_REPO_PROVIDER_NAME)
    private readonly _mongooseModel: Model<IRoleModel>,
  ) {}
  setSession(sess: ClientSession) {
    this._session = sess;
  }
  async insert(payload: ICreateRoleDto): Promise<Partial<IRole>> {
    const newRole = await this._mongooseModel.create(payload);
    const result = await newRole.save();
    return RolesRepository.toDomainRole(result);
  }
  async findOne<OutputEntity extends Partial<IRole>>(options: IQueryObject): Promise<OutputEntity> {
    const result = await this._mongooseModel
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
    const data = RolesRepository.toDomainRole(result);
    return data as OutputEntity;
  }
  async findOneById<OutputEntity extends Partial<IRole>>(id: string): Promise<OutputEntity> {
    const result = await this._mongooseModel.findOne({
      id: id,
    });
    if (result === null) {
      return null;
    }
    const data = RolesRepository.toDomainRole(result);
    return data as OutputEntity;
  }
  async update(options: IQueryObject, updatePayload: any): Promise<number> {
    const result = await this._mongooseModel.updateOne(options.filter, updatePayload);
    return result.modifiedCount;
  }
  async softDelete(options: IQueryObject): Promise<number> {
    const result = await this._mongooseModel.updateMany(options.filter, {
      deletedAt: new Date(),
    });
    return result.modifiedCount;
  }
  async findMany<OutputEntity extends Partial<IRole>>(
    options: IQueryObject,
  ): Promise<Array<OutputEntity>> {
    const result = await this._mongooseModel
      .find(options.filter)
      .populate(options.populate)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .exec();
    const data = RolesRepository.toDomainRoles(result);
    return data as Array<OutputEntity>;
  }
  async count(options: IQueryObject): Promise<number> {
    return this._mongooseModel.count(options.filter);
  }
  static toDomainRoles(data: Array<IRoleModel>): IRole[] {
    return data.map((item) => this.toDomainRole(item));
  }
  static toDomainRole(data: IRoleModel): IRole {
    const role = new Role();
    role.id = data._id.toString();
    role.name = data.name;
    role.permissions = data?.permissions
      ? PermissionsRepository.toDomainPermissions(data.permissions)
      : [];
    return role;
  }
}

export interface IRolesRepository extends IBaseRepository<ICreateRoleDto, IRole> {}
