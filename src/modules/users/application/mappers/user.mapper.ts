import { User } from '@modules/users/domain/entities/user.entity';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';
import { UserEmail } from '@modules/users/domain/value-objects/user-email';

export class UserMapper {
  static toEntity(dto: CreateUserDto): User {
    const email = UserEmail.create(dto.email);
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
}
