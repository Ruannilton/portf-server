import {
  CreateUserMessage,
  CreateUserUseCase,
} from 'src/modules/user/domain/use_cases/user/create_user';
import { GitHubUser } from '../models/github_user';
import { IFederationRepository } from '../repository/federationRepository';
import {
  failed,
  getError,
  getValue,
  isFailure,
  Result,
  succeed,
} from 'src/core/result';
import { LoginUserUseCase } from './loginUserUseCase';
import { AuthResponse } from '../models/auth_response';
import { GetUserUseCase } from 'src/modules/user/domain/use_cases/user/get_user';
import { Injectable, Logger } from '@nestjs/common';
import { IncompleteGithubError } from '../errors/incomplete_github_error';

@Injectable()
export default class SignInFromGithubUseCase {
  private readonly logger = new Logger(SignInFromGithubUseCase.name);

  constructor(
    private readonly federationRepository: IFederationRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  public async execute(data: GitHubUser): Promise<Result<AuthResponse>> {
    const githubId = data.id;

    if (data.emails.length == 0) {
      this.logger.error('Email not provided from github');
      const err = new IncompleteGithubError('Email not provided');
      return failed(err);
    }

    const email = data.emails[0].value;

    const userId = await this.federationRepository.getUserId(
      'github',
      githubId,
    );

    // user already exists
    if (userId != null) {
      this.logger.log('User already registered', {
        username: data.username,
        email,
      });

      const existentUser = await this.getUserUseCase.execute(userId);
      const user = getValue(existentUser);
      const authResponse = await this.loginUseCase.execute(user);
      return succeed(authResponse);
    }

    // create user
    const createUserMessage: CreateUserMessage = {
      email,
      github: data.username,
      linkedin: undefined,
      name: data.displayName,
      bio: data._json.bio,
    };

    const createdUserResult =
      await this.createUserUseCase.execute(createUserMessage);

    if (isFailure(createdUserResult)) {
      const error = getError(createdUserResult);
      this.logger.error('User creation failed', error);
      return failed(error);
    }

    const createdUser = getValue(createdUserResult);

    await this.federationRepository.createFederation(
      'github',
      githubId,
      createdUser.id,
    );

    const authResponse = await this.loginUseCase.execute(createdUser);

    return succeed(authResponse);
  }
}
