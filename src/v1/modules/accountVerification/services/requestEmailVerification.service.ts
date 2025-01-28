import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UNIT_OF_WORK_PROVIDER_NAME } from '../../database/providers.constants';
import { IUnitOfWork } from '../../database/helpers/unitOfWork/unitOfWork.interface';
import { USERS_SERVICE_PROVIDER_NAME } from '../../users/providers.constants';
import { IUsersService } from '../../users/services/users.service';
import {
  HASHING_SERVICE_PROVIDER_NAME,
  MAIL_SERVICE_PROVIDER_NAME,
} from '../../shared/providers.constants';
// import { IMailService } from '../../shared/mailing/services/mailing.service';
import { IHashingService } from '../../shared/hashing/services/hashing.service';
import { IAccountVerificationsRepository } from '../../database/repositories/accountVerification.repository';

@Injectable()
export class RequestAccountEmailVerificationService
  implements IRequestAccountEmailVerificationService
{
  private readonly _accountVerificationsRepo: IAccountVerificationsRepository;
  constructor(
    @Inject(UNIT_OF_WORK_PROVIDER_NAME)
    private readonly _unitOfWork: IUnitOfWork,
    @Inject(USERS_SERVICE_PROVIDER_NAME)
    private readonly _usersService: IUsersService,
    @Inject(HASHING_SERVICE_PROVIDER_NAME) private readonly _hashingService: IHashingService,
  ) {
    this._accountVerificationsRepo = this._unitOfWork.provideAccountVerificationRepository();
  }
  async requestVerification(userId: string): Promise<string> {
    const userFound = await this._usersService.findOneUserById(userId);
    if (!userFound) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: "this account doesn't exist",
        error: 'Unauthorized',
      });
    }
    if (userFound?.isVerified) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'your account is already verified',
        error: 'Unauthorized',
      });
    }

    const token = this._hashingService.hashSha256(userFound.id + Date.now().toString());
    await this._accountVerificationsRepo.insert({
      userId: userFound.id,
      emailToken: token,
      expiresAt: new Date(Date.now() + 20000),
      phoneCode: null,
      used: false,
    });
    // await this._mailService.sendMail({
    //   subject: 'Verify Your Account',
    //   target: userFound.email,
    //   template: 'verify-account-by-mail',
    //   verificationLink: `${process.env.FRONT_END_SITE}/verify-account/email/${token}`,
    //   name: userFound.fullName,
    // });
    return 'Ok';
  }
}
export interface IRequestAccountEmailVerificationService {
  requestVerification(userId: string): Promise<string>;
}
