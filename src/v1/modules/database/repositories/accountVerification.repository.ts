import { Inject } from '@nestjs/common';
import { IBaseRepository } from 'src/types/baseRepository';
import { ClientSession, Model } from 'mongoose';
import { ACCOUNT_VERIFICATIONS_ORM_REPOSITORY_PROVIDER_NAME } from '../providers.constants';
import { IAccountVerificationModel } from '../models/accountVerification.model';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
import {
  AccountVerification,
  IAccountVerification,
} from '../../accountVerification/accountVerification.interface';
import { IQueryObject } from '../../shared/queryParser/queryParser.interface';
import { ICreateAccountVerificationDto } from '../../accountVerification/dto/createAccountVerification';

export class AccountVerificationsRepository implements IAccountVerificationsRepository {
  private _session: ClientSession = null;
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(ACCOUNT_VERIFICATIONS_ORM_REPOSITORY_PROVIDER_NAME)
    private readonly _mongooseModel: Model<IAccountVerificationModel>,
  ) {}
  setSession(sess: ClientSession) {
    this._session = sess;
  }
  async insert(payload: ICreateAccountVerificationDto): Promise<Partial<IAccountVerification>> {
    const user = await this._mongooseModel.create([payload], {
      session: this._session,
    });
    return AccountVerificationsRepository.toDomainAccountVerification(user[0]);
  }
  async findOne<OutputEntity extends Partial<IAccountVerification>>(
    options: any,
  ): Promise<OutputEntity> {
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
    const data = AccountVerificationsRepository.toDomainAccountVerification(result);
    return data as OutputEntity;
  }
  async findOneById<OutputEntity extends Partial<IAccountVerification>>(
    id: string,
  ): Promise<OutputEntity> {
    const result = await this._mongooseModel
      .findOne({
        _id: id,
      })
      .session(this._session);
    if (result === null) {
      return null;
    }
    const data = AccountVerificationsRepository.toDomainAccountVerification(result);
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
  async findMany<OutputEntity extends Partial<IAccountVerification>>(
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
    const data = AccountVerificationsRepository.toDomainAccountVerifications(result);
    return data as Array<OutputEntity>;
  }

  async getUserProfile(id: string): Promise<IAccountVerification> {
    const user = await this._mongooseModel.findOne({ _id: id }).session(this._session);
    return AccountVerificationsRepository.toDomainAccountVerification(user) as IAccountVerification;
  }
  async count(options: IQueryObject): Promise<number> {
    return this._mongooseModel.count(options.filter).session(this._session);
  }

  static toDomainAccountVerifications(
    data: Array<Partial<IAccountVerificationModel>>,
  ): Partial<IAccountVerification>[] {
    return data.map((item) => this.toDomainAccountVerification(item));
  }
  static toDomainAccountVerification(
    data: Partial<IAccountVerificationModel> | null,
  ): Partial<IAccountVerification | null> {
    if (data === null) {
      return null;
    }
    const centralUser = new AccountVerification();
    centralUser.id = data._id.toString();
    centralUser.userId = data.userId.toString();
    centralUser.emailToken = data.emailToken;
    centralUser.phoneCode = data.phoneCode;
    centralUser.expiresAt = data.expiresAt;
    centralUser.used = data.used;
    return centralUser;
  }
}

export interface IAccountVerificationsRepository
  extends IBaseRepository<ICreateAccountVerificationDto, IAccountVerification> {}
