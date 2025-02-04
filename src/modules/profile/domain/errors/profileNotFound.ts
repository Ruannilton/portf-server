import { Error } from 'src/core/result';

export class ProfileNotFound implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'profile not found';
  }
}

export class ProjectNotFound implements Error {
  title: string;
  description: string;
  constructor(title: string) {
    this.title = title;
    this.description = 'project not found';
  }
}
