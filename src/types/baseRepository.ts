export interface IBaseRepository<CreateInput, DefaultOutputEntity> {
  insert(payload: CreateInput): Promise<DefaultOutputEntity | Partial<DefaultOutputEntity>>;
  findOne<OutputEntity extends Partial<DefaultOutputEntity>>(
    payload: any,
  ): Promise<OutputEntity | null>;
  findOneById<OutputEntity extends DefaultOutputEntity>(id: string): Promise<OutputEntity | null>;
  findMany<OutputEntity extends DefaultOutputEntity>(filter: any): Promise<Array<OutputEntity>>;
  update(filter: any, updatePayload: any): Promise<number>;
  softDelete(filter: any): Promise<number>;
  count(filter: any): Promise<number>;
}
