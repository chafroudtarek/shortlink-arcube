import { Inject, Injectable } from '@nestjs/common';
import { PERMISSIONS_REPO_PROVIDER_NAME } from 'src/v1/modules/database/providers.constants';
import { IPermissionsRepository } from 'src/v1/modules/database/repositories/permissions.repository';
import { IPaginationReturn, IPaginator } from 'src/v1/modules/shared/paginator/paginator.interface';
import { PAGINATOR_PROVIDER_NAME } from 'src/v1/modules/shared/providers.constants';
import { ICreatePermissionDto } from '../dtos/createPermissionDto';
import { IPermission } from '../permissions.interface';
import { IQueryObject } from 'src/v1/modules/shared/queryParser/queryParser.interface';

@Injectable()
export class PermissionsService implements IPermissionsService {
  constructor(
    @Inject(PERMISSIONS_REPO_PROVIDER_NAME)
    private readonly _permissionsRepo: IPermissionsRepository,
    @Inject(PAGINATOR_PROVIDER_NAME) private readonly _paginator: IPaginator,
  ) {}
  async create(payload: ICreatePermissionDto) {
    const result = await this._permissionsRepo.insert(payload);
    return result;
  }
  async getOneById(id: string): Promise<IPermission> {
    const result = await this._permissionsRepo.findOneById(id);
    return result;
  }
  async getOne(filter: IQueryObject) {
    const result = await this._permissionsRepo.findOne<IPermission>(filter);
    return result;
  }
  async softDeleteOne(filter: IQueryObject): Promise<number> {
    const result = await this._permissionsRepo.softDelete(filter);
    return result;
  }
  async update(filter: IQueryObject, payload: Partial<IPermission>) {
    const result = await this._permissionsRepo.update(filter, payload);
    return result;
  }
  async getAll(filter: IQueryObject): Promise<IPaginationReturn<IPermission[]>> {
    const count = await this._permissionsRepo.count({ filter: { deletedAt: { $eq: null } } });
    const result = await this._permissionsRepo.findMany<IPermission>(filter);
    const paginatedResult = await this._paginator.paginateQuery(count, result, {
      skip: filter.skip,
      limit: filter.limit,
    });
    return paginatedResult;
  }
}
export interface IPermissionsService {
  getOneById(id: string): Promise<IPermission>;
  getOne(filter: IQueryObject): Promise<IPermission>;
  create(payload: ICreatePermissionDto): Promise<IPermission | Partial<IPermission>>;
  getAll(filter: IQueryObject): Promise<IPaginationReturn<IPermission[]>>;
  update(filter: IQueryObject, payload: Partial<IPermission>): Promise<number>;
  softDeleteOne(filter: IQueryObject): Promise<number>;
}
