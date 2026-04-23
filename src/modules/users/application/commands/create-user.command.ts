import { Injectable } from '@nestjs/common';
// import { IUserRepository } from '@modules/users/domain/ports/i-user.repository';
// import { UserMapper } from '@modules/users/application/mappers/user.mapper';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
// import { User } from '@modules/users/domain/entities/user.entity';
// import { EmailAlreadyInUseException } from '@modules/users/domain/exceptions/email-already-in-use.exception';

@Injectable()
export class CreateUserCommand {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    throw new Error('Not implemented');
    // // 1️⃣ Check if email already exists
    // const existing = await this.userRepository.findByEmail(dto.email);
    // if (existing) {
    //   throw new EmailAlreadyInUseException();
    // }
    // // 2️⃣ Build a User entity – fields that the DB will generate are left undefined
    // const userToSave = new User(
    //   undefined, // id
    //   dto.email,
    //   dto.name,
    //   'credentials', // authProvider (default)
    //   3, // credits (default)
    //   undefined, // profileData
    //   undefined, // createdAt
    //   undefined, // updatedAt
    // );
    // // 3️⃣ Persist – the adapter will call prisma.user.create(...) and get back a full row
    // const savedUser: User = await this.userRepository.save(userToSave);
    // // 4️⃣ Map to response DTO (now id, createdAt, updatedAt are defined)
    // return UserMapper.toResponseDto(savedUser);
  }
}
