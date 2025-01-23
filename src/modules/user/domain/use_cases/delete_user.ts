import { failed, Result, succeed } from 'src/core/result';
import { IUserRepository } from '../repositories/user_repository';
import { UserNotFoundError } from '../errors/user_not_found';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}
  public async execute(id: string): Promise<Result> {
    const user = await this.userRepository.GetUser(id);

    if (user == null) {
      return failed(new UserNotFoundError('Fail to delete user'));
    }

    await this.userRepository.RemoveUser(id);

    return succeed(undefined);
  }
}
