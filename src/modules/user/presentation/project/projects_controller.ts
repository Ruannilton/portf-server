import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  CreateProjectMessage,
  CreateProjectUseCase,
} from '../../domain/use_cases/project/create_project';
import {
  ProjectUpdateMessage,
  UpdateProjectUseCase,
} from '../../domain/use_cases/project/update_project';
import { GetProjectsUseCase } from '../../domain/use_cases/project/get_projects';
import { DeleteProjectUseCase } from '../../domain/use_cases/project/delete_project';
import { Response } from 'express';
import { CreateProjectRequest } from './create-project-request';
import { UpdateProjectRequest } from './UpdateProjectRequest';
import { getError, getValue, isFailure } from 'src/core/result';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
export class ProjectsController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @Get('/users/:userId/projects')
  async listProjects(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    const result = await this.getProjectsUseCase.execute(userId);

    if (isFailure(result)) {
      const err = getError(result);
      response.status(400).json(err);
    }

    const value = getValue(result);

    response.status(200).json(value);
  }

  @Post('/users/:userId')
  async postProject(
    @Param('userId') userId: string,
    @Body() body: CreateProjectRequest,
    @Res() response: Response,
  ) {
    const message: CreateProjectMessage = {
      userId: userId,
      ...body,
    };

    const result = await this.createProjectUseCase.execute(message);

    if (isFailure(result)) {
      const err = getError(result);
      response.status(400).json(err);
    }

    const value = getValue(result);

    response.status(200).json(value);
  }

  @Put('/projetcs/:projectId')
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() body: UpdateProjectRequest,
    @Res() response: Response,
  ) {
    const message: ProjectUpdateMessage = {
      ...body,
    };

    const result = await this.updateProjectUseCase.execute(projectId, message);

    if (isFailure(result)) {
      const err = getError(result);
      response.status(400).json(err);
    }

    response.sendStatus(200);
  }

  @Delete('/projetcs/:projectId')
  async deleteProject(
    @Param('projectId') projectId: number,
    @Res() response: Response,
  ) {
    const result = await this.deleteProjectUseCase.execute(projectId);

    if (isFailure(result)) {
      const err = getError(result);
      response.status(400).json(err);
    }

    response.sendStatus(200);
  }
}
