import { IsDate, IsDateString, IsNotEmpty, Length } from 'class-validator';
import { IsEndDateAfterStartDate } from '../validators/update-date-validator';

export class CreateProjectRequest {
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
  @IsNotEmpty()
  @Length(3, 255)
  brief: string;
  description: string | null;
  repository_link: string | null;
  @IsDateString()
  startDate: Date | null;
  @IsDateString()
  @IsEndDateAfterStartDate()
  endDate: Date | null;
}
