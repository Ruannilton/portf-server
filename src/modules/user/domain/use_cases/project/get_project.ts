import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { failed, Result, succeed } from 'src/core/result';
import { Project } from '../../entities/project';
import { ProjectNotFoundError } from '../../errors/ProjectNotFoundError';

@Injectable()
export class GetProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  public async execute(projectId: number): Promise<Result<Project>> {
    const project = await this.projectRepository.GetProject(projectId);

    if (project == null) {
      return failed(new ProjectNotFoundError('Failed to get project'));
    }

    return succeed(project);
  }
}
