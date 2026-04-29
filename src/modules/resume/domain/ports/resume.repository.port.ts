import { Resume } from '@modules/resume/domain/entities/resume.entity';

export interface IResumeRepository {
  save(resume: Resume): Promise<Resume>;
  findByUserId(userId: string): Promise<Resume[]>;
  findById(id: string): Promise<Resume | null>;
}
