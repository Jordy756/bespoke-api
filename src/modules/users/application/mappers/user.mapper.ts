import { User } from '@modules/users/domain/entities/user.entity';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.id!,
      email: user.email,
      name: user.name,
      credits: user.credits,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    });
  }
  // Optional helper to go from DTO → entity fields (excluding DB‑generated ones)
  static toEntity(dto: CreateUserDto, authProvider: string = 'credentials'): Partial<User> {
    return {
      email: dto.email,
      name: dto.name,
      authProvider,
      credits: 3, // default credits as per schema
      profileData: undefined,
      // id, createdAt, updatedAt left undefined – will be set by DB
    };
  }
}
