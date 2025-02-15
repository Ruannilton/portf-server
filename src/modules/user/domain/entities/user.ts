import { Project } from './project';

export class User {
  id: string;
  name: string;
  github: string;
  email: string;
  linkedIn: string | null;
  bio: string;
  projects: Project[];

  constructor(name: string, email: string, part: Partial<User>) {
    this.email = email;
    this.name = name;
    Object.assign(this, part);
  }
}
