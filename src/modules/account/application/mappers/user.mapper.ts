import { CreateUserDto } from '@modules/account/application/dtos/create-user.dto';
import { LoginUserDto } from '@modules/account/application/dtos/login-user.dto';
import { UserResponseDto } from '@modules/account/application/dtos/user-response.dto';
import { User } from '@modules/account/domain/entities/user.entity';
import { UserEmail } from '@modules/account/domain/value-objects/user-email';

export class UserMapper {
  static toCreateEntity(dto: CreateUserDto): User {
    return User.createNew(dto.email, dto.provider, dto.providerId, dto.name, dto.avatarUrl);
  }

  static toLoginEntity(dto: LoginUserDto): UserEmail {
    return UserEmail.create(dto.email);
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
