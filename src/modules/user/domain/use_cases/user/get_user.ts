import { failed, Result, succeed } from 'src/core/result';
import { IUserRepository } from '../../repositories/user_repository';
import { User } from '../../entities/user';
import { UserNotFoundError } from '../../errors/user_not_found';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  public async execute(id: string): Promise<Result<User>> {
    const user = await this.userRepository.GetUser(id);

    if (user == null) {
      return failed(new UserNotFoundError('Fail to get user'));
    }

    return succeed(user);
  }
}
