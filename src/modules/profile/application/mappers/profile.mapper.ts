import { InitializeProfileDto } from '@modules/profile/application/dtos/initialize-profile.dto';
import { ProfileResponseDto } from '@modules/profile/application/dtos/profile-response.dto';
import { Profile, ProfileData } from '@modules/profile/domain/entities/profile.entity';

export class ProfileMapper {
  static toInitializeEntity(userId: string, dto: InitializeProfileDto): Profile {
    return Profile.createNew(userId, dto.data);
  }

  static toDomain(dbRecord: { id: string; userId: string; data: unknown; createdAt: Date; updatedAt: Date }): Profile {
    return Profile.reconstruct({
      id: dbRecord.id,
      userId: dbRecord.userId,
      data: dbRecord.data as ProfileData,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    });
  }

  static toDTO(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id!,
      userId: profile.userId,
      data: profile.data,
      createdAt: profile.createdAt!,
      updatedAt: profile.updatedAt!,
    };
  }
}
