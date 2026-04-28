import { CreateUserDto } from '@modules/account/application/dtos/create-user.dto';
import { UserResponseDto } from '@modules/account/application/dtos/user-response.dto';
import { User } from '@modules/account/domain/entities/user.entity';

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
