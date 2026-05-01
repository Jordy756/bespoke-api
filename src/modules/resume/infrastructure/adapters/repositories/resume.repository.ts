import { PrismaService } from '@core/database/prisma.service';
import { ResumeMapper } from '@modules/resume/application/mappers/resume.mapper';
import { Resume } from '@modules/resume/domain/entities/resume.entity';
import { IResumeRepository } from '@modules/resume/domain/ports/resume.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResumeRepository implements IResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(resume: Resume): Promise<Resume> {
    const { userId, jobTitle, fitScore, data } = resume;

    const saved = await this.prisma.resume.create({
      data: { userId, jobTitle, fitScore, data },
    });

    return ResumeMapper.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<Resume[]> {
    const records = await this.prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => ResumeMapper.toDomain(record));
  }

  async findById(id: string): Promise<Resume | null> {
    const record = await this.prisma.resume.findUnique({
      where: { id },
    });

    return record ? ResumeMapper.toDomain(record) : null;
  }
}
