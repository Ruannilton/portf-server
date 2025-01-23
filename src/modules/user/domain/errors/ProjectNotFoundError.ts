import { Error } from 'src/core/result';

export class ProjectNotFoundError implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'project not found';
  }
}
