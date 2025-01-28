import { ClientSession, Model } from 'mongoose';
import { ILogger } from '../../core/logger/logger.interface';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { IPermissionModel } from '../models/permission.model';
import { PERMISSIONS_ORM_REPO_PROVIDER_NAME } from '../providers.constants';
import { Inject } from '@nestjs/common';
import { ICreatePermissionDto } from '../../auth/permissions/dtos/createPermissionDto';
import { IPermission, Permission } from '../../auth/permissions/permissions.interface';
import { IQueryObject } from '../../shared/queryParser/queryParser.interface';
import { IBaseRepository } from 'src/types/baseRepository';

export class PermissionsRepository implements IPermissionsRepository {
  private _session: ClientSession = null;
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(PERMISSIONS_ORM_REPO_PROVIDER_NAME)
    private readonly _mongooseModel: Model<IPermissionModel>,
  ) {}
  setSession(sess: ClientSession) {
    this._session = sess;
  }
  async insert(payload: ICreatePermissionDto): Promise<Partial<IPermission>> {
    const newPermission = await this._mongooseModel.create(payload);
    const result = await newPermission.save();
    this._logger.debug('Permission Repo', JSON.stringify(result));
    return PermissionsRepository.toDomainPermission(result);
  }
  async findOne<OutputEntity extends Partial<IPermission>>(options: any): Promise<OutputEntity> {
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
    const data = PermissionsRepository.toDomainPermission(result);
    return data as OutputEntity;
  }
  async findOneById<OutputEntity extends IPermission>(id: string): Promise<OutputEntity> {
    const result = await this._mongooseModel.findOne({
      id: id,
    });
    if (result === null) {
      return null;
    }
    const data = PermissionsRepository.toDomainPermission(result);
    return data as OutputEntity;
  }
  async update(options: IQueryObject, updatePayload: any): Promise<number> {
    const result = await this._mongooseModel.updateOne(options.filter, updatePayload);
    return result.modifiedCount;
  }
  async softDelete(options: IQueryObject): Promise<number> {
    const result = await this._mongooseModel.updateMany(options.filter, {
      deletedAt: Date.now(),
    });
    return result.modifiedCount;
  }
  async findMany<OutputEntity extends Partial<IPermission>>(
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
    const data = PermissionsRepository.toDomainPermissions(result);
    return data as Array<OutputEntity>;
  }
  async count(options: IQueryObject): Promise<number> {
    return this._mongooseModel.count(options.filter);
  }
  static toDomainPermissions(data: Array<Partial<IPermissionModel>>): Partial<IPermission>[] {
    return data.map((item) => this.toDomainPermission(item));
  }
  static toDomainPermission(data: Partial<IPermissionModel>): Partial<IPermission> {
    const permission = new Permission();
    permission.id = data._id.toString();
    permission.name = data.name;
    return permission;
  }
}

export interface IPermissionsRepository
  extends IBaseRepository<ICreatePermissionDto, IPermission> {}
