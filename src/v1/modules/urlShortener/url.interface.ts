export interface IUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  lastAccessedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class Url implements IUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  lastAccessedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}
