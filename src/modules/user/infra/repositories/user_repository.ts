import { Result, succeed } from 'src/core/result';
import { User } from 'src/modules/user/domain/entities/user';
import { IUserRepository } from 'src/modules/user/domain/repositories/user_repository';
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import withRetry from 'src/core/retry';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;
  private readonly logger = new Logger(UserRepository.name);

  constructor() {
    const libsql = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    });

    const adapter = new PrismaLibSQL(libsql);
    this.prisma = new PrismaClient({ adapter });
  }

  async AddUser(user: User): Promise<Result<User>> {
    const res = await withRetry(
      () =>
        this.prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            github: user.github,
            linkedin: user.linkedIn,
            bio: user.bio,
          },
        }),
      this.logger,
    );

    const userCreated: User = {
      id: res.id,
      email: res.email,
      github: res.github,
      linkedIn: res.linkedin,
      name: res.name,
      bio: res.bio,
      projects: [],
    };

    const result = succeed(userCreated);

    return Promise.resolve(result);
  }

  async GetUser(id: string): Promise<User | null> {
    const user = await withRetry(
      () => this.prisma.user.findFirst({ where: { id: id } }),
      this.logger,
    );

    if (user == null) return null;

    return {
      id: user.id,
      email: user.email,
      github: user.github,
      linkedIn: user.linkedin,
      name: user.name,
      bio: user.bio,
      projects: [],
    };
  }

  async RemoveUser(id: string): Promise<void> {
    await withRetry(
      () => this.prisma.user.delete({ where: { id: id } }),
      this.logger,
    );
  }

  async UpdateUser(id: string, updatedUser: User): Promise<void> {
    await withRetry(
      () =>
        this.prisma.user.update({
          where: { id: id },
          data: {
            email: updatedUser.email,
            github: updatedUser.github,
            linkedin: updatedUser.linkedIn,
            name: updatedUser.name,
            bio: updatedUser.bio,
          },
        }),
      this.logger,
    );
  }
}
