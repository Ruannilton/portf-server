import { CreateUserUseCase } from 'src/modules/user/domain/use_cases/user/create_user';
import { IFederationRepository } from '../repository/federationRepository';
import { User } from 'src/modules/user/domain/entities/user';
import { GitHubUser } from '../models/github_user';
import { getValue, isFailure } from 'src/core/result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateGitHubFederatedUserUseCase {
  constructor(
    private readonly federationRepository: IFederationRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  public async execute(
    federationRef: string,
    userInfo: GitHubUser,
  ): Promise<User | null> {
    const userResult = await this.createUserUseCase.execute({
      name: userInfo.displayName,
      email: userInfo.emails[0].value,
      github: userInfo.profileUrl,
      linkedin: undefined,
    });

    if (isFailure(userResult)) return null;

    const user = getValue(userResult);

    await this.federationRepository.createFederation(
      'github',
      federationRef,
      user.id,
    );
    console.log('New user created:', user);
    return user;
  }
}
