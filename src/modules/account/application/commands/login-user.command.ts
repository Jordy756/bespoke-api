import type { User } from '@modules/account/domain/entities/user.entity';
import type { IAccountRepository } from '@modules/account/domain/ports/account.repository.port';
import type { UserEmail } from '@modules/account/domain/value-objects/user-email';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LoginUserCommand {
  constructor(@Inject('IAccountRepository') private readonly accountRepository: IAccountRepository) {}

  async execute(email: UserEmail): Promise<User | null> {
    return await this.accountRepository.findByEmail(email);
  }
}
