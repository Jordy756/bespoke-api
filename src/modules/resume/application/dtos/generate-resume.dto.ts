import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateResumeDto {
  @ApiProperty({
    description: 'The job offer description for which the resume should be generated',
    example: 'We are looking for a software engineer with experience in TypeScript and NestJS.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  jobOffer!: string;
}
