import { Result, succeed } from 'src/core/result';
import { IFederationRepository } from '../repository/federationRepository';
import UserFederations from '../../presentation/userFederationsResponse';

export default class GetFederationsUseCase {
  constructor(private readonly federationRepository: IFederationRepository) {}
  public async execute(userId: string): Promise<Result<UserFederations>> {
    const federations = await this.federationRepository.listFederations(userId);

    const response: UserFederations = {
      userId,
      federations: federations.map((f) => {
        return { federation: f.provider, id: f.providerRef };
      }),
    };

    return succeed(response);
  }
}
