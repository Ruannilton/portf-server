import { Result, getError, isSuccess } from 'src/core/result';
import { User } from '../../entities/user';
import { IUserRepository } from '../../repositories/user_repository';
import { Injectable, Logger } from '@nestjs/common';

export class CreateUserMessage {
  name: string;
  email: string;
  linkedin: string | undefined;
  github: string | undefined;
  bio: string | undefined;
}

@Injectable()
export class CreateUserUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}
  private readonly logger = new Logger(CreateUserUseCase.name);

  public async execute(message: CreateUserMessage): Promise<Result<User>> {
    const user = new User(message.name, message.email, message);

    const createdResult = await this.userRepository.AddUser(user);

    if (!isSuccess(createdResult)) {
      const err = getError(createdResult);
      this.logger.error('Failed to create user', err);
      return createdResult;
    }
    // Todo: enviar email de notificação

    this.logger.log('User created');
    return createdResult;
  }
}
