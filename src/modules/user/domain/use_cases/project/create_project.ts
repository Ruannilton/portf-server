import { failed, isFailure, Result } from 'src/core/result';
import { Project } from '../../entities/project';
import { GetUserUseCase } from '../user/get_user';
import { UserNotFoundError } from '../../errors/user_not_found';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { Injectable } from '@nestjs/common';
import { InvalidParameters } from '../../errors/InvalidParameters';

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

    if (
      message.endDate != null &&
      (message.startDate == null || message.endDate < message.startDate)
    ) {
      return failed(
        new InvalidParameters('endDate cannot be before startDate'),
      );
    }

    if (isFailure(userResult)) {
      return failed(new UserNotFoundError('Fail to crate project'));
    }

    const project = new Project();
    Object.assign(project, message);
    project.keys = [];
    const createResult = await this.projectsRepository.AddProject(project);

    if (isFailure(createResult)) {
      return createResult;
    }

    return createResult;
  }
}
