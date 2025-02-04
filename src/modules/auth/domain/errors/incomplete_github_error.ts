import { Error } from 'src/core/result';

export class IncompleteGithubError implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'incomplete github';
  }
}
