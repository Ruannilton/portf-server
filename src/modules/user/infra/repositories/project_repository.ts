import { Result, succeed } from 'src/core/result';
import { Project } from '../../domain/entities/project';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { convertJsonValueToStringArray } from 'src/core/utils';
import withRetry from 'src/core/retry';

@Injectable()
export class projectRepository implements IProjectRepository {
  private readonly prisma: PrismaClient;
  private readonly logger = new Logger(projectRepository.name);

  constructor() {
    const libsql = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    });

    const adapter = new PrismaLibSQL(libsql);
    this.prisma = new PrismaClient({ adapter });
  }

  public async AddProject(project: Project): Promise<Result<Project>> {
    const res = await withRetry(
      () =>
        this.prisma.project.create({
          data: {
            brief: project.brief,
            name: project.name,
            description: project.description,
            endDate: project.endDate
              ? new Date(project.endDate.toString())
              : null,
            repository_link: project.repository_link,
            startDate: new Date(project.startDate.toString()),
            userId: project.userId,
            keys: JSON.stringify(project.keys),
          },
        }),
      this.logger,
    );

    const created: Project = {
      brief: res.brief,
      description: res.description,
      endDate: res.endDate,
      id: res.id,
      name: res.name,
      repository_link: res.repository_link,
      startDate: res.startDate,
      userId: res.userId,
      keys: convertJsonValueToStringArray(res.keys),
    };
    return succeed(created);
  }

  public async GetProjects(userId: string): Promise<Array<Project>> {
    const response = await withRetry(
      () =>
        this.prisma.project.findMany({
          where: { userId: userId },
        }),
      this.logger,
    );

    const mapped: Array<Project> = response.map((x) => {
      return {
        brief: x.brief,
        description: x.description,
        endDate: x.endDate,
        id: x.id,
        name: x.name,
        repository_link: x.repository_link,
        startDate: x.startDate,
        userId: x.userId,
        keys: convertJsonValueToStringArray(x.keys),
      };
    });

    return mapped;
  }

  public async GetProject(id: number): Promise<Project | null> {
    const projectFound = await withRetry(
      () =>
        this.prisma.project.findFirst({
          where: { id: id },
        }),
      this.logger,
    );

    if (projectFound == null) return null;

    const project: Project = {
      brief: projectFound.brief,
      description: projectFound.description,
      endDate: projectFound.endDate,
      id: projectFound.id,
      name: projectFound.name,
      repository_link: projectFound.repository_link,
      startDate: projectFound.startDate,
      userId: projectFound.userId,
      keys: convertJsonValueToStringArray(projectFound.keys),
    };

    return project;
  }

  public async RemoveProject(id: number): Promise<void> {
    await withRetry(
      () => this.prisma.project.delete({ where: { id: id } }),
      this.logger,
    );
  }

  public async UpdateProject(id: number, project: Project): Promise<void> {
    await withRetry(
      () =>
        this.prisma.project.update({
          where: { id: id },
          data: {
            brief: project.brief,
            description: project.description,
            endDate: project.endDate,
            name: project.name,
            repository_link: project.repository_link,
            startDate: project.startDate,
            keys: JSON.stringify(project.keys),
          },
        }),
      this.logger,
    );
  }
}
