import { Inject, Injectable } from '@nestjs/common';
import { IRole } from '../roles.interface';
import { ROLES_REPO_PROVIDER_NAME } from 'src/v1/modules/database/providers.constants';
import { IRolesRepository } from 'src/v1/modules/database/repositories/role.repository';
import { PAGINATOR_PROVIDER_NAME } from 'src/v1/modules/shared/providers.constants';
import { IPaginationReturn, IPaginator } from 'src/v1/modules/shared/paginator/paginator.interface';
import { ICreateRoleDto } from '../dtos/createRoleDto';
import { IQueryObject } from 'src/v1/modules/shared/queryParser/queryParser.interface';

@Injectable()
export class RolesService implements IRolesService {
  constructor(
    @Inject(ROLES_REPO_PROVIDER_NAME)
    private readonly _rolesRepository: IRolesRepository,
    @Inject(PAGINATOR_PROVIDER_NAME) private readonly _paginator: IPaginator,
  ) {}
  async create(payload: ICreateRoleDto) {
    const result = await this._rolesRepository.insert(payload);
    return result;
  }
  async getOneById(id: string): Promise<IRole> {
    const result = await this._rolesRepository.findOneById(id);
    return result;
  }
  async getOne(filter: IQueryObject) {
    const result = await this._rolesRepository.findOne<IRole>(filter);
    return result;
  }
  async softDeleteOne(filter: IQueryObject): Promise<number> {
    const result = await this._rolesRepository.softDelete(filter);
    return result;
  }
  async update(filter: IQueryObject, payload: Partial<IRole>) {
    const result = await this._rolesRepository.update(filter, payload);
    return result;
  }
  async getAll(filter: IQueryObject): Promise<IPaginationReturn<IRole[]>> {
    const count = await this._rolesRepository.count({ filter: { deletedAt: { $eq: null } } });
    const result = await this._rolesRepository.findMany<IRole>(filter);
    const paginatedResult = await this._paginator.paginateQuery(count, result, {
      skip: filter.skip,
      limit: filter.limit,
    });
    return paginatedResult;
  }
}

export interface IRolesService {
  getOneById(id: string): Promise<IRole>;
  getOne(filter: IQueryObject): Promise<IRole>;
  create(payload: ICreateRoleDto): Promise<IRole | Partial<IRole>>;
  getAll(filter: IQueryObject): Promise<IPaginationReturn<IRole[]>>;
  update(filter: IQueryObject, payload: Partial<IRole>): Promise<number>;
  softDeleteOne(filter: IQueryObject): Promise<number>;
}
