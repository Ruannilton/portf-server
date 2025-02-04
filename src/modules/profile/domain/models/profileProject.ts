export interface ProfileProject {
  id: number;
  name: string;
  brief: string;
  startDate: Date;
  endDate: Date | null;
  keys: string[];
  repoLink: string | null;
}
