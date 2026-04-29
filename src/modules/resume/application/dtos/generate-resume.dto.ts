import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateResumeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  jobOffer!: string;
}
