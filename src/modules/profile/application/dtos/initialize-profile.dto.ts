import { IsObject, IsOptional, IsString } from 'class-validator';

export class InitializeProfileDto {
  @IsString()
  userId!: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
