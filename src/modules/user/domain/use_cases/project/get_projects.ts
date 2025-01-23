import { failed, isFailure, Result, succeed } from 'src/core/result';
import { IProjectRepository } from '../../repositories/IProjectRepository';
import { Project } from '../../entities/project';
import { GetUserUseCase } from '../user/get_user';
import { UserNotFoundError } from '../../errors/user_not_found';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly getUsersUseCase: GetUserUseCase,
  ) {}

  public async execute(userId: string): Promise<Result<Project[]>> {
    const userResult = await this.getUsersUseCase.execute(userId);

    if (isFailure(userResult)) {
      return failed(new UserNotFoundError('Fail to list projects'));
    }

    const projects = await this.projectRepository.GetProjects(userId);

    return succeed(projects);
  }
}
