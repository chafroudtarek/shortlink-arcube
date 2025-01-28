import { IRole } from '../roles/roles.interface';

export interface IPermission {
  id: string;
  name: string;
  roles: Partial<IRole>[];
}

export class Permission implements Partial<IPermission> {
  id: string;
  name: string;
  roles: Partial<IRole>[];
}
