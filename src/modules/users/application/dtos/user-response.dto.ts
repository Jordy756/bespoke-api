import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  // @Expose()
  // name?: string;

  // @Expose()
  // credits!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
