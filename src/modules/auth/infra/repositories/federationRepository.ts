import { Injectable } from '@nestjs/common';
import { IFederationRepository } from '../../domain/repository/federationRepository';
import { AuthPrismaService } from '../db/prisma.service';

@Injectable()
export class FederationRepository implements IFederationRepository {
  constructor(private readonly prisma: AuthPrismaService) {}

  public async getUserId(
    provider: string,
    providerRef: string,
  ): Promise<string | null> {
    const fed = await this.prisma.federation.findFirst({
      where: { provider, providerRef },
    });

    return fed?.userId ?? null;
  }

  public async createFederation(
    provider: string,
    providerRef: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.federation.create({
      data: { provider, providerRef, userId },
    });
  }
  public async deleteFederation(
    provider: string,
    providerRef: string,
  ): Promise<void> {
    await this.prisma.federation.deleteMany({
      where: { provider, providerRef },
    });
  }
}
