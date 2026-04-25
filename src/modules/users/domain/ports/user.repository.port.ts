import type { User } from '@modules/users/domain/entities/user.entity';
// import type { UserEmail } from '@modules/users/domain/value-objects/user-email';

export interface IUserRepository {
  save(user: User): Promise<User>;
  // findByEmail(email: UserEmail): Promise<User | undefined>;
  // findById(id: string): Promise<User | undefined>;
}
