import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
  @IsEmail()
  email: string;
  linkedin: string | undefined;
  github: string | undefined;
}
