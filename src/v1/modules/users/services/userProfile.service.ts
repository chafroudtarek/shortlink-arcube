import { Inject } from '@nestjs/common';
import { UserProfile } from '../dtos/userProfile';
import { IUserProfile } from '../users.interface';
import { USERS_REPO_PROVIDER_NAME } from '../../database/providers.constants';
import { IUsersRepository } from '../../database/repositories/user.repository';

export class UsersProfileService implements IUsersProfileService {
  constructor(
    @Inject(USERS_REPO_PROVIDER_NAME)
    private readonly _usersRepository: IUsersRepository,
  ) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const userProfile = await this._usersRepository.findOne<IUserProfile>({
      filter: { _id: userId },
    });
    return userProfile;
  }
}

export interface IUsersProfileService {
  getUserProfile(userId: string): Promise<UserProfile>;
}
