import { IsObject } from 'class-validator';

export class UpdateProfileDataDto {
  @IsObject()
  data!: Record<string, any>;
}
