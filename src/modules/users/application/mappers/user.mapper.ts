import { User } from '@modules/users/domain/entities/user.entity';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';

export class UserMapper {
  static toDTO(user: User): UserResponseDto {
    throw new Error('Method not implemented.');
  }

  static toEntity(createUserDto: CreateUserDto): User {
    // return User.createNew(createUserDto.email);
    throw new Error('Method not implemented.');
  }
}
