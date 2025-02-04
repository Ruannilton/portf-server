import { IsNotEmpty, Length } from 'class-validator';

export class CreateProjectRequest {
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
  @IsNotEmpty()
  @Length(3, 255)
  brief: string;
  description: string | null;
  repository_link: string | null;

  startDate: Date | null;

  endDate: Date | null;
}
