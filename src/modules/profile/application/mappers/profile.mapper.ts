import { Profile } from '@modules/profile/domain/entities/profile.entity';
import { ProfileResponseDto } from '@modules/profile/application/dtos/profile-response.dto';

export class ProfileMapper {
  static toDomain(prismaEntity: any): Profile {
    return new Profile(
      prismaEntity.id,
      prismaEntity.userId,
      prismaEntity.data as Record<string, any>,
      prismaEntity.createdAt,
      prismaEntity.updatedAt,
    );
  }

  static toDTO(domainEntity: Profile): ProfileResponseDto {
    return {
      id: domainEntity.id,
      userId: domainEntity.userId,
      data: domainEntity.data,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
    };
  }
}
