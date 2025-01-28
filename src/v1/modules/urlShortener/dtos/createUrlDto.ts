export interface ICreateUrlDto {
  originalUrl: string;
  shortCode?: string;
  accessCount?: number;
  lastAccessedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
