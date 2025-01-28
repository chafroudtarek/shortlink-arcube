import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountVerification } from '../accountVerification.interface';
import { UNIT_OF_WORK_PROVIDER_NAME } from '../../database/providers.constants';
import { IUnitOfWork } from '../../database/helpers/unitOfWork/unitOfWork.interface';
import { USERS_SERVICE_PROVIDER_NAME } from '../../users/providers.constants';
import { IUsersService } from '../../users/services/users.service';
import { IUsersRepository } from '../../database/repositories/user.repository';
import { IAccountVerificationsRepository } from '../../database/repositories/accountVerification.repository';

@Injectable()
export class AccountEmailVerificationService implements IAccountEmailVerificationService {
  private readonly _accountVerificationsRepo: IAccountVerificationsRepository;
  private readonly _centralUsersRepo: IUsersRepository;
  constructor(
    @Inject(UNIT_OF_WORK_PROVIDER_NAME)
    private readonly _unitOfWork: IUnitOfWork,
    @Inject(USERS_SERVICE_PROVIDER_NAME)
    private readonly _usersService: IUsersService,
  ) {
    this._accountVerificationsRepo = this._unitOfWork.provideAccountVerificationRepository();
    this._centralUsersRepo = this._unitOfWork.provideUsersRepository();
  }
  async verifyAccount(payload: { userId: string; token: string }): Promise<string> {
    const { userId, token } = payload;
    const userFound = await this._usersService.findOneUserById(payload.userId);
    if (!userFound) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: "this account doesn't exist ",
        error: 'Unauthorized',
      });
    }
    if (userFound.isVerified) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'your account is already verified',
        error: 'Unauthorized',
      });
    }
    const verificationFound = await this._accountVerificationsRepo.findOne<AccountVerification>({
      filter: {
        emailToken: token,
        userId: userId,
      },
    });
    if (!verificationFound) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'token is not valid',
      });
    }
    if (verificationFound.isExpired() || verificationFound.isUsed()) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'verification token is expired',
      });
    }
    await this._accountVerificationsRepo.update(
      {
        filter: {
          _id: verificationFound.id,
        },
      },
      {
        used: true,
      },
    );
    await this._centralUsersRepo.update(
      {
        filter: {
          _id: userFound.id,
        },
      },
      {
        isVerified: true,
      },
    );
    return 'Ok';
  }
}
export interface IAccountEmailVerificationService {
  verifyAccount(payload: { userId: string; token: string }): Promise<string>;
}
