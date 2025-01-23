import { Result, succeed } from 'src/core/result';
import { User } from 'src/modules/user/domain/entities/user';
import { IUserRepository } from 'src/modules/user/domain/repositories/user_repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async AddUser(user: User): Promise<Result<User>> {
    const res = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        github: user.github,
        linkedin: user.linkedIn,
      },
    });

    const userCreated: User = {
      id: res.id,
      email: res.email,
      github: res.github,
      linkedIn: res.linkedin,
      name: res.name,
      projects: [],
    };

    const result = succeed(userCreated);

    return Promise.resolve(result);
  }

  async GetUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { id: id } });

    if (user == null) return null;

    return {
      id: user.id,
      email: user.email,
      github: user.github,
      linkedIn: user.linkedin,
      name: user.name,
      projects: [],
    };
  }

  async RemoveUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: id } });
  }

  async UpdateUser(id: string, updatedUser: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: id },
      data: {
        email: updatedUser.email,
        github: updatedUser.github,
        linkedin: updatedUser.linkedIn,
        name: updatedUser.name,
      },
    });
  }
}
