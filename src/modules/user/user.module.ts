import { Module } from '@nestjs/common';
import { UserController } from './presentation/user/users_controller';
import { CreateUserUseCase } from './domain/use_cases/user/create_user';
import { DeleteUserUseCase } from './domain/use_cases/user/delete_user';
import { GetUserUseCase } from './domain/use_cases/user/get_user';
import { UpdateUserUseCase } from './domain/use_cases/user/update_user';
import { IUserRepository } from './domain/repositories/user_repository';
import { UserRepository } from 'src/modules/user/infra/repositories/user_repository';
import { PrismaService } from './infra/db/prisma.service';
import { IProjectRepository } from './domain/repositories/IProjectRepository';
import { projectRepository } from './infra/repositories/project_repository';
import { CreateProjectUseCase } from './domain/use_cases/project/create_project';
import { DeleteProjectUseCase } from './domain/use_cases/project/delete_project';
import { GetProjectsUseCase } from './domain/use_cases/project/get_projects';
import { UpdateProjectUseCase } from './domain/use_cases/project/update_project';
import { ProjectsController } from './presentation/project/projects_controller';

@Module({
  imports: [],
  controllers: [UserController, ProjectsController],
  providers: [
    PrismaService,
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    CreateProjectUseCase,
    DeleteProjectUseCase,
    GetProjectsUseCase,
    UpdateProjectUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IProjectRepository,
      useClass: projectRepository,
    },
  ],
})
export class UserModule {}
