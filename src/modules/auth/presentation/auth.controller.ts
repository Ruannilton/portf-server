import {
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GitHubAuthGuard } from '../domain/guards/githubAuthGuard';
import { GitHubUser } from '../domain/models/github_user';
import { AuthGuard } from '../domain/guards/authGuard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUserUseCase } from 'src/modules/user/domain/use_cases/user/get_user';
import { getError, getValue, isFailure } from 'src/core/result';
import SignInFromGithubUseCase from '../domain/use_cases/signInFromGithubUseCase';
import GetFederationsUseCase from '../domain/use_cases/getFederationsUseCase';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly getUser: GetUserUseCase,
    private readonly getFederations: GetFederationsUseCase,
    private readonly signInFromGithub: SignInFromGithubUseCase,
  ) {}

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  @Header('Access-Control-Allow-Origin', '*')
  async githubLogin(): Promise<void> {
    // Redireciona para o GitHub
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  @Header('Access-Control-Allow-Origin', '*')
  async githubCallback(@Req() req, @Res() response: Response): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const gitUser: GitHubUser = req.user as GitHubUser;

    if (gitUser == null) {
      this.logger.error('Data not provided by github');
      response.sendStatus(400);
      return;
    }

    const authResult = await this.signInFromGithub.execute(gitUser);

    if (isFailure(authResult)) {
      const error = getError(authResult);
      this.logger.error('Error', error);
      response.status(400).json(error);
      return;
    }

    const auth = getValue(authResult);
    response.status(200).json(auth);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Header('Access-Control-Allow-Origin', '*')
  async me(@Req() req, @Res() response: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user.sub as string;
    const userResult = await this.getUser.execute(userId);

    if (isFailure(userResult)) {
      const err = getError(userResult);
      response.status(404).json(err);
      return;
    }
    const user = getValue(userResult);
    response.status(200).json(user);
  }

  @Get('/users/:id/federations')
  @ApiBearerAuth()
  async getGithubAccount(@Param('id') id: string, @Res() response: Response) {
    const result = await this.getFederations.execute(id);

    if (isFailure(result)) {
      const err = getError(result);
      response.status(404).json(err);
      return;
    }

    const account = getValue(result);
    response.status(200).json(account);
  }
}
