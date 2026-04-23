export class UserResponseDto {
  id: string;
  email: string;
  name?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
