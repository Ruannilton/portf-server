import { Injectable } from '@nestjs/common';
import { IFederationRepository } from '../repository/federationRepository';
import { GitHubAccount } from '../models/github_account';
import { failed, Result, succeed } from 'src/core/result';
import { FederationNotFound } from '../errors/federation_not_found';

@Injectable()
export class GetGitHubAccountUseCase {
  constructor(protected readonly federationRepository: IFederationRepository) {}

  public async execute(id: string): Promise<Result<GitHubAccount>> {
    const fed = await this.federationRepository.getFederation('github', id);

    if (fed == null) {
      return failed(new FederationNotFound('failed to get federation'));
    }

    const acc: GitHubAccount = {
      id: fed.providerRef,
      name: '',
    };

    return succeed(acc);
  }
}
