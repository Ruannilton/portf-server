import { User } from 'src/modules/user/domain/entities/user';

export class CreateUseReponse {
  id: string;

  constructor(user: User) {
    this.id = user.id;
  }
}
