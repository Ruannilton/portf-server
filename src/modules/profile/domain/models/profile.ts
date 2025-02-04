import { ProfileProject } from './profileProject';

export interface Profile {
  name: string;
  bio: string;
  projects: ProfileProject[];
  linkedIn: string | null;
  github: string | null;
  email: string;
}
