import { User } from '@modules/users/domain/entities/user.entity';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';

export class UserMapper {
  static toCreateEntity({ email }: CreateUserDto): User {
    return User.createNew(email);
  }

  static toDTO(user: User): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = user.id!;
    dto.email = user.email.getValue();
    dto.createdAt = user.createdAt!;
    dto.updatedAt = user.updatedAt!;

    return dto;
  }

  static toDTOs(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toDTO(user));
  }
}
