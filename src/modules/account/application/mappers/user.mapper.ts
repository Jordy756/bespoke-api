import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

export class UserMapper {
  static toCreateEntity(dto: CreateUserDto): User {
    return User.createNew(dto.email, dto.provider, dto.providerId, dto.name, dto.avatarUrl);
  }

  static toDTO(user: User): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = user.id!;
    dto.email = user.email.getValue();
    dto.provider = user.provider;
    dto.name = user.name ?? undefined;
    dto.avatarUrl = user.avatarUrl ?? undefined;
    dto.plan = user.plan;
    dto.dailyCredits = user.dailyCredits;
    dto.createdAt = user.createdAt!;
    dto.updatedAt = user.updatedAt!;

    return dto;
  }

  static toDTOs(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toDTO(user));
  }
}
