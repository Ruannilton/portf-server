import { Error } from 'src/core/result';

export class UserNotFoundError implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'user not found';
  }
}
