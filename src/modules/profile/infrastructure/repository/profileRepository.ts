import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { convertJsonValueToStringArray } from 'src/core/utils';
import { IProfileRepository } from '../../domain/repository/iProfileRepository';
import { Profile } from '../../domain/models/profile';
import { Injectable, Logger } from '@nestjs/common';
import withRetry from 'src/core/retry';
import { Project } from 'src/modules/user/domain/entities/project';

@Injectable()
export default class ProfileRepository implements IProfileRepository {
  private readonly prisma: PrismaClient;
  private readonly logger: Logger = new Logger(ProfileRepository.name);
  constructor() {
    const libsql = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    });

    const adapter = new PrismaLibSQL(libsql);
    this.prisma = new PrismaClient({ adapter });
  }
  public async getProject(
    userName: string,
    projectName: string,
  ): Promise<Project | null> {
    const foundProject = await withRetry(
      () =>
        this.prisma.project.findFirst({
          where: {
            name: projectName,
            User: { github: userName },
          },
        }),
      this.logger,
    );

    if (foundProject == null) return null;

    const mappedProject = {
      brief: foundProject.brief,
      description: foundProject.description,
      endDate: foundProject.endDate,
      id: foundProject.id,
      name: foundProject.name,
      repository_link: foundProject.repository_link,
      startDate: foundProject.startDate,
      userId: foundProject.userId,
      keys: convertJsonValueToStringArray(foundProject.keys),
    };

    return mappedProject;
  }

  public async getProfile(userName: string): Promise<Profile | null> {
    const user = await withRetry(
      () =>
        this.prisma.user.findFirst({
          where: { github: userName },
        }),
      this.logger,
    );

    if (user == null) return null;

    const projects = await withRetry(
      () =>
        this.prisma.project.findMany({
          where: { userId: user.id },
        }),
      this.logger,
    );

    const prof: Profile = {
      name: user.name,
      bio: user.bio,
      github: user.github,
      linkedIn: user.linkedin,
      email: user.email,
      projects: projects.map((p) => {
        return {
          id: p.id,
          brief: p.brief,
          endDate: p.endDate,
          startDate: p.startDate,
          repoLink: p.repository_link,
          name: p.name,
          keys: convertJsonValueToStringArray(p.keys),
        };
      }),
    };

    return prof;
  }
}
