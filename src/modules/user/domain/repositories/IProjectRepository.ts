import { Result } from 'src/core/result';
import { Project } from '../entities/project';

export abstract class IProjectRepository {
  public abstract AddProject(project: Project): Promise<Result<Project>>;
  public abstract GetProjects(userId: string): Promise<Array<Project>>;
  public abstract GetProject(id: number): Promise<Project | null>;
  public abstract RemoveProject(id: number): Promise<void>;
  public abstract UpdateProject(id: number, project: Project): Promise<void>;
}
