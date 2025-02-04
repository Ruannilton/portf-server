import { Project } from 'src/modules/user/domain/entities/project';
import { Profile } from '../models/profile';

export abstract class IProfileRepository {
  public abstract getProfile(userName: string): Promise<Profile | null>;
  public abstract getProject(
    userName: string,
    projectName: string,
  ): Promise<Project | null>;
}
