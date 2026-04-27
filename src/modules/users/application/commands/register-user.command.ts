import { User } from '@modules/users/domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
// import { UserAlreadyExistsException } from '@modules/users/domain/exceptions/user-already-exists.exception';
import type { IUserRepository } from '@modules/users/domain/ports/user.repository.port';

@Injectable()
export class RegisterUserCommand {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    const userEmail = user.email.getValue();

    // const existingUser = await this.userRepository.findByEmail(userEmail);
    // if (existingUser) {
    //   throw new UserAlreadyExistsException(userEmail.getValue());
    // }

    const userWithHashedPassword = User.reconstruct(user['id'] || '', user['email']);

    const persistedUser = await this.userRepository.save(userWithHashedPassword);

    return persistedUser;
  }
}
