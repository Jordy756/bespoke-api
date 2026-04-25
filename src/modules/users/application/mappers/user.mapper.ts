import { plainToInstance } from 'class-transformer';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { UserPersistence } from '@modules/users/infrastructure/persistence/user.persistence';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id!;
    response.email = user['email'].getValue();
    response.createdAt = user['createdAt'] || new Date();
    response.updatedAt = user['updatedAt'] || new Date();

    return plainToInstance(UserResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  static toPersistenceModel(user: User): UserPersistence {
    return {
      id: user.id || '',
      email: user['email'].getValue(),
      createdAt: user['createdAt'] || new Date(),
      updatedAt: user['updatedAt'] || new Date(),
    };
  }
}
