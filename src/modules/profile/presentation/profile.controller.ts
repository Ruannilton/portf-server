import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { getError, getValue, isFailure } from 'src/core/result';
import { GetProfileUseCase } from '../domain/use_cases/getProfileUseCase';
import { GetProjectUseCase } from '../domain/use_cases/getProjectUseCase';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
  ) {}

  @Get('/:username')
  async GetUserProfile(
    @Param('username') username: string,
    @Res() response: Response,
  ) {
    const profileResult = await this.getProfileUseCase.execute(username);

    if (isFailure(profileResult)) {
      const err = getError(profileResult);
      response.status(400).json(err);
      return;
    }

    const profile = getValue(profileResult);

    response.status(200).json(profile);
  }

  @Get('/:userName/project/:projectName')
  async GetProject(
    @Param('userName') userName: string,
    @Param('projectName') projectName: string,
    @Res() response: Response,
  ) {
    const projectResult = await this.getProjectUseCase.execute(
      userName,
      projectName,
    );

    if (isFailure(projectResult)) {
      const err = getError(projectResult);
      response.status(400).json(err);
      return;
    }

    const project = getValue(projectResult);

    response.status(200).json(project);
  }
}
