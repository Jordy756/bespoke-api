import { User } from '@modules/users/domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@modules/users/domain/ports/user.repository.port';

@Injectable()
export class RegisterUserCommand {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
