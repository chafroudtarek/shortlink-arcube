import { IPermission } from '../permissions/permissions.interface';

export interface IRole {
  id: string;
  name: string;
  permissions?: Partial<IPermission>[];
}

export class Role implements Partial<IRole> {
  id: string;
  name: string;
  permissions?: Partial<IPermission>[];
}
