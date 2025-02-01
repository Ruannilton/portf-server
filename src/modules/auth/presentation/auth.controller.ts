import { Controller, Get, Header, Req, Res, UseGuards } from '@nestjs/common';
import { GitHubAuthGuard } from '../domain/guards/githubAuthGuard';
import { GitHubUser } from '../domain/models/github_user';
import { FindFederatedUserUseCase } from '../domain/use_cases/findFederatedUserUseCase';
import { CreateGitHubFederatedUserUseCase } from '../domain/use_cases/createGitHubFederatedUserUseCase';
import { LoginUserUseCase } from '../domain/use_cases/loginUserUseCase';
import { AuthGuard } from '../domain/guards/authGuard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUserUseCase } from 'src/modules/user/domain/use_cases/user/get_user';
import { getError, getValue, isFailure } from 'src/core/result';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly findFederationUseCase: FindFederatedUserUseCase,
    private readonly createGitHubFederationUseCase: CreateGitHubFederatedUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly getUser: GetUserUseCase,
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
  async githubCallback(@Req() req): Promise<any> {
    const gitUser: GitHubUser = req.user;

    if (gitUser == null) {
      return {
        message: 'Unexpected data from GitHub',
        user: req.user,
      };
    }

    const user = await this.findFederationUseCase.execute('github', gitUser.id);

    if (user != null) {
      const token = await this.loginUseCase.execute(user);
      return token;
    }

    const createdUser = await this.createGitHubFederationUseCase.execute(
      gitUser.id,
      gitUser,
    );

    if (createdUser == null) {
      return {
        message: 'Fail to create user',
      };
    }

    const token = await this.loginUseCase.execute(createdUser);
    return token;
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Header('Access-Control-Allow-Origin', '*')
  async me(@Req() req, @Res() response: Response) {
    const userId = req.user.sub;
    const userResult = await this.getUser.execute(userId);

    if (isFailure(userResult)) {
      const err = getError(userResult);
      response.status(404).json(err);
    }
    const user = getValue(userResult);
    response.status(200).json(user);
  }
}
