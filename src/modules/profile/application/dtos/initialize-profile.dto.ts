import { IsObject, IsOptional } from 'class-validator';

export class InitializeProfileDto {
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
