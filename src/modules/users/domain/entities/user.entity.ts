import { UserEmail } from '@modules/users/domain/value-objects/user-email';

export class User {
  private constructor(
    public readonly id: string | undefined,
    public readonly email: UserEmail,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static createNew(email: string): User {
    const userEmail = UserEmail.create(email);
    return new User(undefined, userEmail);
  }

  static reconstruct(id: string, email: UserEmail, createdAt?: Date, updatedAt?: Date): User {
    return new User(id, email, createdAt, updatedAt);
  }
}
