import { Resume } from '@modules/resume/domain/entities/resume.entity';
import type { IAiResumeService } from '@modules/resume/domain/ports/ai-resume.service.port';
import type { ICompressorService } from '@modules/resume/domain/ports/compressor.service.port';
import type { IResumeRepository } from '@modules/resume/domain/ports/resume.repository.port';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProfileRepository } from '../../../profile/domain/ports/profile.repository.port';

@Injectable()
export class GenerateResumeCommand {
  constructor(
    @Inject('IResumeRepository') private readonly resumeRepository: IResumeRepository,
    @Inject('IProfileCompressorService') private readonly compressorService: ICompressorService,
    @Inject('IAiResumeService') private readonly aiService: IAiResumeService,
    @Inject('IProfileRepository') private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string, jobOffer: string): Promise<Resume> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) throw new NotFoundException('Core profile not found. Please setup your profile first.');

    const compressedProfile = this.compressorService.compress(profile.data);
    const aiResult = await this.aiService.generateTailoredResume(compressedProfile, jobOffer);
    const decompressedData = this.compressorService.decompress(aiResult.toonData);
    const resume = Resume.createNew(userId, aiResult.jobTitle, aiResult.fitScore, decompressedData);

    return await this.resumeRepository.save(resume);
  }
}
