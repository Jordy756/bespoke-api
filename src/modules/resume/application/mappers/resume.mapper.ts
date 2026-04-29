import { ResumeResponseDto } from '@modules/resume/application/dtos/resume-response.dto';
import { Resume } from '@modules/resume/domain/entities/resume.entity';

export class ResumeMapper {
  static toDTO(domainEntity: Resume): ResumeResponseDto {
    return {
      id: domainEntity.id as string,
      userId: domainEntity.userId,
      jobTitle: domainEntity.jobTitle,
      fitScore: domainEntity.fitScore,
      data: domainEntity.data,
      createdAt: domainEntity.createdAt as Date,
      updatedAt: domainEntity.updatedAt as Date,
    };
  }

  // Not used directly in commands, but useful for rebuilding from DB responses (infrastructure layer helper)
  static toDomain(data: any): Resume {
    if (!data) return null;
    return Resume.reconstruct({
      id: data.id,
      userId: data.userId,
      jobTitle: data.jobTitle,
      fitScore: data.fitScore,
      data: data.data as Record<string, any>,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
