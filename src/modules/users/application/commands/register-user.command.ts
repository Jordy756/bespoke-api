import { User } from '@modules/users/domain/entities/user.entity';
import { UserEmail } from '@modules/users/domain/value-objects/user-email';
import { Inject, Injectable } from '@nestjs/common';
// import { UserAlreadyExistsException } from '@modules/users/domain/exceptions/user-already-exists.exception';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { UserMapper } from '@modules/users/application/mappers/user.mapper';
import type { IUserRepository } from '@modules/users/domain/ports/user.repository.port';

@Injectable()
export class RegisterUserCommand {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute(command: { email: string }): Promise<UserResponseDto> {
    const userEmail = UserEmail.create(command.email);

    // const existingUser = await this.userRepository.findByEmail(userEmail);
    // if (existingUser) {
    //   throw new UserAlreadyExistsException(userEmail.getValue());
    // }

    const newUser = User.createNew(userEmail);

    const userWithHashedPassword = User.reconstruct(newUser['id'] || '', newUser['email']);

    const persistedUser = await this.userRepository.save(userWithHashedPassword);

    return UserMapper.toResponseDto(persistedUser);
  }
}
