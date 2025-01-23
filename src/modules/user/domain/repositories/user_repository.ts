import { Result } from 'src/core/result';
import { User } from '../entities/user';

export abstract class IUserRepository {
  public abstract AddUser(user: User): Promise<Result<User>>;
  public abstract GetUser(id: string): Promise<User | null>;
  public abstract RemoveUser(id: string): Promise<void>;
  public abstract UpdateUser(id: string, user: User): Promise<void>;
}
