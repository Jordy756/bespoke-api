import type { User } from '@modules/account/domain/entities/user.entity';
import type { UserEmail } from '@modules/account/domain/value-objects/user-email';

export interface IAccountRepository {
  create(user: User): Promise<User>;
  findByEmail(email: UserEmail): Promise<User | null>;
}
