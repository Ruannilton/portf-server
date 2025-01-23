import { Injectable } from '@nestjs/common';
import { failed, Result, succeed } from 'src/core/result';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { ProjectNotFoundError } from '../../errors/ProjectNotFoundError';

export class ProjectUpdateMessage {
  name: string | undefined;
  brief: string | undefined;
  description: string | undefined;
  repository_link: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  public async execute(
    id: number,
    message: ProjectUpdateMessage,
  ): Promise<Result> {
    const project = await this.projectRepository.GetProject(id);
    if (project == null) {
      return failed(new ProjectNotFoundError('Failed to update project'));
    }

    Object.assign(project, message);

    await this.projectRepository.UpdateProject(id, project);

    return succeed(undefined);
  }
}
