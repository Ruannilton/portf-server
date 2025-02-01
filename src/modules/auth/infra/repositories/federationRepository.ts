import { Injectable } from '@nestjs/common';
import { IFederationRepository } from '../../domain/repository/federationRepository';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { Federation } from '../../domain/models/federation';

@Injectable()
export class FederationRepository implements IFederationRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    const libsql = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    });

    const adapter = new PrismaLibSQL(libsql);
    this.prisma = new PrismaClient({ adapter });
  }
  public async getFederation(
    provider: string,
    userId: string,
  ): Promise<Federation | null> {
    const fed = await this.prisma.federation.findFirst({
      where: { provider, userId },
    });

    if (fed != null) {
      const response: Federation = {
        provider: fed.provider,
        providerRef: fed.providerRef,
        userId: fed.userId,
      };
      return response;
    }

    return null;
  }

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
