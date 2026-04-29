export class ResumeResponseDto {
  id!: string;
  userId!: string;
  jobTitle!: string;
  fitScore!: number;
  data!: Record<string, any>;
  createdAt!: Date;
  updatedAt!: Date;
}
