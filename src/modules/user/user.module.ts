import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/users_controller';
import { CreateUserUseCase } from './domain/use_cases/create_user';
import { DeleteUserUseCase } from './domain/use_cases/delete_user';
import { GetUserUseCase } from './domain/use_cases/get_user';
import { UpdateUserUseCase } from './domain/use_cases/update_user';
import { IUserRepository } from './domain/repositories/user_repository';
import { UserRepository } from 'src/modules/user/infra/repositories/user_repository';
import { PrismaService } from './infra/db/prisma.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    PrismaService,
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
