import { Module } from '@nestjs/common';
import { IProfileRepository } from './domain/repository/iProfileRepository';
import ProfileRepository from './infrastructure/repository/profileRepository';
import { GetProfileUseCase } from './domain/use_cases/getProfileUseCase';
import { ProfileController } from './presentation/profile.controller';
import { GetProjectUseCase } from './domain/use_cases/getProjectUseCase';

@Module({
  providers: [
    GetProfileUseCase,
    GetProjectUseCase,
    {
      provide: IProfileRepository,
      useClass: ProfileRepository,
    },
  ],
  controllers: [ProfileController],
})
export class ProfileModule {}
