import { failed, Result, succeed } from 'src/core/result';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { ProjectNotFoundError } from '../../errors/ProjectNotFoundError';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}
  public async execute(id: number): Promise<Result> {
    const project = await this.projectRepository.GetProject(id);

    if (project == null) {
      return failed(new ProjectNotFoundError('Failed to remove project'));
    }

    await this.projectRepository.RemoveProject(id);

    return succeed(undefined);
  }
}
