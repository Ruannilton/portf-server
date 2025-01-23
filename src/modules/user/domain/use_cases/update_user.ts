import { failed, Result, succeed } from 'src/core/result';
import { IUserRepository } from '../repositories/user_repository';
import { UserNotFoundError } from '../errors/user_not_found';
import { Injectable } from '@nestjs/common';

export class UpateUserMessage {
  id: string;
  name: string | undefined;
  email: string | undefined;
  linkedIn: string | undefined;
  github: string | undefined;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  public async execute(message: UpateUserMessage): Promise<Result<void>> {
    const user = await this.userRepository.GetUser(message.id);

    if (user == null) {
      return failed(new UserNotFoundError('Fail to update user'));
    }

    Object.assign(user, message);

    await this.userRepository.UpdateUser(message.id, user);

    return succeed(undefined);
  }
}
