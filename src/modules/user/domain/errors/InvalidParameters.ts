import { Error } from 'src/core/result';

export class InvalidParameters implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'invalid parameters';
  }
}
