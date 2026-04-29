import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { ProfileModule } from '../profile/profile.module';

import { ResumeController } from './infrastructure/http/controllers/resume.controller';
import { GenerateResumeCommand } from './application/commands/generate-resume.command';

import { ResumeRepository } from './infrastructure/adapters/repositories/resume.repository';
import { ToonCompressorService } from './infrastructure/adapters/services/toon-compressor.service';
import { MockAiResumeService } from './infrastructure/adapters/services/mock-ai-resume.service';

@Module({
  imports: [CoreModule, ProfileModule], // Import ProfileModule to get access to IProfileRepository
  controllers: [ResumeController],
  providers: [
    GenerateResumeCommand,
    {
      provide: 'IResumeRepository',
      useClass: ResumeRepository,
    },
    {
      provide: 'IProfileCompressorService',
      useClass: ToonCompressorService,
    },
    {
      provide: 'IAiResumeService',
      useClass: MockAiResumeService, // Swap this out for OpenAiResumeService later
    },
  ],
})
export class ResumeModule {}
