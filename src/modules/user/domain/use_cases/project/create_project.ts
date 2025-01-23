import { failed, isFailure, Result } from 'src/core/result';
import { Project } from '../../entities/project';
import { GetUserUseCase } from '../user/get_user';
import { UserNotFoundError } from '../../errors/user_not_found';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { Injectable } from '@nestjs/common';

export class CreateProjectMessage {
  userId: string;
  name: string;
  brief: string;
  description: string | null;
  repository_link: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

@Injectable()
export class CreateProjectUseCase {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly projectsRepository: IProjectRepository,
  ) {}

  public async execute(
    message: CreateProjectMessage,
  ): Promise<Result<Project>> {
    const userResult = await this.getUserUseCase.execute(message.userId);

    if (isFailure(userResult)) {
      return failed(new UserNotFoundError('Fail to crate project'));
    }

    const project = new Project();
    Object.assign(project, message);

    const createResult = await this.projectsRepository.AddProject(project);

    if (isFailure(createResult)) {
      return createResult;
    }

    return createResult;
  }
}
