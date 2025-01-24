import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GitHubAuthGuard } from '../domain/guards/githubAuthGuard';
import { GitHubUser } from '../domain/models/github_user';
import { FindFederatedUserUseCase } from '../domain/use_cases/findFederatedUserUseCase';
import { CreateGitHubFederatedUserUseCase } from '../domain/use_cases/createGitHubFederatedUserUseCase';
import { LoginUserUseCase } from '../domain/use_cases/loginUserUseCase';
import { AuthGuard } from '../domain/guards/authGuard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly findFederationUseCase: FindFederatedUserUseCase,
    private readonly createGitHubFederationUseCase: CreateGitHubFederatedUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
  ) {}
  @Get('github')
  @UseGuards(GitHubAuthGuard)
  async githubLogin(): Promise<void> {
    // Redireciona para o GitHub
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
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
      return await this.loginUseCase.execute(user);
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

    return await this.loginUseCase.execute(createdUser);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  me(@Req() req, @Res() response: Response) {
    const userId = req.user.sub;
    response.status(200).json(userId);
  }
}
