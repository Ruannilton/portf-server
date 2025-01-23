export class User {
  id: string;
  name: string;
  email: string;
  linkedIn: string | null;
  github: string | null;

  constructor(name: string, email: string, part: Partial<User>) {
    this.email = email;
    this.name = name;
    Object.assign(this, part);
  }
}
