import { failed, Result, succeed } from 'src/core/result';
import { IProfileRepository } from '../repository/iProfileRepository';
import { Injectable } from '@nestjs/common';
import { Project } from 'src/modules/user/domain/entities/project';
import { ProjectNotFound } from '../errors/profileNotFound';

@Injectable()
export class GetProjectUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  public async execute(
    userName: string,
    projectName: string,
  ): Promise<Result<Project>> {
    const project = await this.profileRepository.getProject(
      userName,
      projectName,
    );

    if (project == null) {
      return failed(new ProjectNotFound('Project not found'));
    }

    return succeed(project);
  }
}
