import { User } from '@modules/account/domain/entities/user.entity';
import type { IAccountRepository } from '@modules/account/domain/ports/account.repository.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RegisterUserCommand {
  constructor(@Inject('IAccountRepository') private readonly accountRepository: IAccountRepository) {}

  async execute(user: User): Promise<User> {
    return await this.accountRepository.save(user);
  }
}
