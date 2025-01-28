import { Inject } from '@nestjs/common';
import { IBaseRepository } from 'src/types/baseRepository';
import { ClientSession, Model } from 'mongoose';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
import { IQueryObject } from '../../shared/queryParser/queryParser.interface';
import { IUrlModel } from '../models/url.model';
import { Url, IUrl } from '../../urlShortener/url.interface';
import { ICreateUrlDto } from '../../urlShortener/dtos/createUrlDto';

export const URL_ORM_REPOSITORY_PROVIDER_NAME = 'URL_ORM_REPOSITORY';

export class UrlsRepository implements IUrlsRepository {
  private _session: ClientSession = null;

  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(URL_ORM_REPOSITORY_PROVIDER_NAME)
    private readonly _mongooseModel: Model<IUrlModel>,
  ) {}

  setSession(sess: ClientSession) {
    this._session = sess;
  }

  async insert(payload: ICreateUrlDto): Promise<Partial<IUrl>> {
    const url = await this._mongooseModel.create([payload], {
      session: this._session,
    });
    return UrlsRepository.toDomainUrl(url[0]);
  }

  async findOne<OutputEntity extends Partial<IUrl>>(options: IQueryObject): Promise<OutputEntity> {
    const result = await this._mongooseModel
      .findOne(options.filter)
      .populate(options.populate)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .session(this._session)
      .exec();
    if (result === null) {
      return null;
    }
    const data = UrlsRepository.toDomainUrl(result);
    return data as OutputEntity;
  }

  async findOneById<OutputEntity extends Partial<IUrl>>(id: string): Promise<OutputEntity> {
    const result = await this._mongooseModel
      .findOne({
        _id: id,
      })
      .session(this._session);
    if (result === null) {
      return null;
    }
    const data = UrlsRepository.toDomainUrl(result);
    return data as OutputEntity;
  }

  async update(options: IQueryObject, updatePayload: any): Promise<number> {
    const result = await this._mongooseModel
      .updateOne(options.filter, updatePayload)
      .session(this._session);
    return result.modifiedCount;
  }

  async softDelete(options: IQueryObject): Promise<number> {
    const result = await this._mongooseModel
      .updateMany(options.filter, {
        deletedAt: Date.now(),
      })
      .session(this._session);
    return result.modifiedCount;
  }

  async findMany<OutputEntity extends Partial<IUrl>>(
    options: IQueryObject,
  ): Promise<Array<OutputEntity>> {
    const result = await this._mongooseModel
      .find(options.filter)
      .populate(options.populate)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .session(this._session)
      .exec();
    const data = UrlsRepository.toDomainUrls(result);
    return data as Array<OutputEntity>;
  }

  async count(options: IQueryObject): Promise<number> {
    return this._mongooseModel.count(options.filter).session(this._session);
  }

  async findByShortCode(shortCode: string): Promise<IUrl> {
    const url = await this._mongooseModel
      .findOne({ shortCode, deletedAt: { $exists: false } })
      .session(this._session);
    return UrlsRepository.toDomainUrl(url) as IUrl;
  }

  static toDomainUrls(data: Array<Partial<IUrlModel>>): Partial<IUrl>[] {
    return data.map((item) => this.toDomainUrl(item));
  }

  static toDomainUrl(data: Partial<IUrlModel> | null): Partial<IUrl | null> {
    if (data === null) {
      return null;
    }
    const url = new Url();
    url.id = data._id.toString();
    url.originalUrl = data.originalUrl;
    url.shortCode = data.shortCode;
    url.accessCount = data.accessCount;
    url.lastAccessedAt = data.lastAccessedAt;
    url.createdAt = data.createdAt;
    url.updatedAt = data.updatedAt;
    url.deletedAt = data.deletedAt;
    return url;
  }
}

export interface IUrlsRepository extends IBaseRepository<ICreateUrlDto, IUrl> {
  findByShortCode(shortCode: string): Promise<IUrl>;
}
