export abstract class IFederationRepository {
  public abstract getUserId(
    provider: string,
    providerRef: string,
  ): Promise<string | null>;

  public abstract createFederation(
    provider: string,
    providerRef: string,
    userId: string,
  ): Promise<void>;

  public abstract deleteFederation(
    provider: string,
    providerRef: string,
  ): Promise<void>;
}
