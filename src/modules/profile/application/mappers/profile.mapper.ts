import { Profile } from '@modules/profile/domain/entities/profile.entity';
import { ProfileResponseDto } from '@modules/profile/application/dtos/profile-response.dto';
import { InitializeProfileDto } from '@modules/profile/application/dtos/initialize-profile.dto';
import { JsonValue } from '@prisma/client/runtime/client';

export class ProfileMapper {
  static toDomain(data: { id: string; userId: string; data: JsonValue; createdAt: Date; updatedAt: Date }): Profile {
    return Profile.reconstruct({
      id: data.id,
      userId: data.userId,
      data: data.data as Record<string, any>,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toCreateEntity(userId: string, dto: InitializeProfileDto): Profile {
    return Profile.createNew(userId, dto.data);
  }

  static toDTO(domainEntity: Profile): ProfileResponseDto {
    return {
      id: domainEntity.id as string,
      userId: domainEntity.userId,
      data: domainEntity.data,
      createdAt: domainEntity.createdAt as Date,
      updatedAt: domainEntity.updatedAt as Date,
    };
  }
}
