import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GitHubStrategy } from './domain/strategies/github.strategy';
import { AuthController } from './presentation/auth.controller';

import { UserModule } from '../user/user.module';
import { IFederationRepository } from './domain/repository/federationRepository';
import { FederationRepository } from './infra/repositories/federationRepository';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserUseCase } from './domain/use_cases/loginUserUseCase';
import { AuthGuard } from './domain/guards/authGuard';
import SignInFromGithubUseCase from './domain/use_cases/signInFromGithubUseCase';
import GetFederationsUseCase from './domain/use_cases/getFederationsUseCase';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github' }),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    GitHubStrategy,
    SignInFromGithubUseCase,
    GetFederationsUseCase,
    {
      provide: IFederationRepository,
      useClass: FederationRepository,
    },
    LoginUserUseCase,
    AuthGuard,
  ],
})
export class AuthModule {}
