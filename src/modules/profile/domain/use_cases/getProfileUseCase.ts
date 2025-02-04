import { Result, failed, succeed } from 'src/core/result';
import { IProfileRepository } from '../repository/iProfileRepository';
import { Profile } from '../models/profile';
import { ProfileNotFound } from '../errors/profileNotFound';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  public async execute(userName: string): Promise<Result<Profile>> {
    const profile = await this.profileRepository.getProfile(userName);

    if (profile == null) {
      return failed(new ProfileNotFound('Profile not found'));
    }

    return succeed(profile);
  }
}
