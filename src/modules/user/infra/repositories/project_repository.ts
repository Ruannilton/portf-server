import { Result, succeed } from 'src/core/result';
import { Project } from '../../domain/entities/project';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { PrismaService } from '../db/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class projectRepository implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async AddProject(project: Project): Promise<Result<Project>> {
    const res = await this.prisma.project.create({
      data: {
        brief: project.brief,
        name: project.name,
        description: project.description,
        endDate: project.endDate ? new Date(project.endDate.toString()) : null,
        repository_link: project.repository_link,
        startDate: project.startDate
          ? new Date(project.startDate.toString())
          : null,
        userId: project.userId,
      },
    });

    const created: Project = {
      brief: res.brief,
      description: res.description,
      endDate: res.endDate,
      id: res.id,
      name: res.name,
      repository_link: res.repository_link,
      startDate: res.startDate,
      userId: res.userId,
    };
    return succeed(created);
  }

  public async GetProjects(userId: string): Promise<Array<Project>> {
    const response = await this.prisma.project.findMany({
      where: { userId: userId },
    });

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
      };
    });

    return mapped;
  }

  public async GetProject(id: number): Promise<Project | null> {
    const projectFound = await this.prisma.project.findFirst({
      where: { id: id },
    });

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
    };

    return project;
  }

  public async RemoveProject(id: number): Promise<void> {
    await this.prisma.project.delete({ where: { id: id } });
  }

  public async UpdateProject(id: number, project: Project): Promise<void> {
    await this.prisma.project.update({
      where: { id: id },
      data: {
        brief: project.brief,
        description: project.description,
        endDate: project.endDate,
        name: project.name,
        repository_link: project.repository_link,
        startDate: project.startDate,
      },
    });
  }
}
