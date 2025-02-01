import { Error } from 'src/core/result';

export class FederationNotFound implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'federation not found';
  }
}
