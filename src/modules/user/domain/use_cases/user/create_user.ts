import { Result, isSuccess } from 'src/core/result';
import { User } from '../../entities/user';
import { IUserRepository } from '../../repositories/user_repository';
import { Injectable } from '@nestjs/common';

export class CreateUserMessage {
  name: string;
  email: string;
  linkedin: string | undefined;
  github: string | undefined;
}

@Injectable()
export class CreateUserUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  public async execute(message: CreateUserMessage): Promise<Result<User>> {
    const user = new User(message.name, message.email, message);

    const createdResult = await this.userRepository.AddUser(user);

    if (!isSuccess(createdResult)) {
      return createdResult;
    }
    // Todo: enviar email de notificação

    return createdResult;
  }
}
