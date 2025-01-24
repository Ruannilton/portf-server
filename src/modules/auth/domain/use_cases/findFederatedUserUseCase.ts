import { GetUserUseCase } from 'src/modules/user/domain/use_cases/user/get_user';
import { IFederationRepository } from '../repository/federationRepository';
import { User } from 'src/modules/user/domain/entities/user';
import { getValue, isFailure } from 'src/core/result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindFederatedUserUseCase {
  constructor(
    private federationRepository: IFederationRepository,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async execute(provider: string, providerRef: string): Promise<User | null> {
    const userId = await this.federationRepository.getUserId(
      provider,
      providerRef,
    );

    if (userId == null) return null;

    const userResult = await this.getUserUseCase.execute(userId);

    if (isFailure(userResult)) return null;

    const user = getValue(userResult);
    return user;
  }
}
