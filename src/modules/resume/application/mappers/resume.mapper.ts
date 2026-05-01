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

  static toDomain(data: {
    jobTitle: string;
    fitScore: number;
    id: string;
    userId: string;
    data: unknown;
    createdAt: Date;
    updatedAt: Date;
  }): Resume {
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
