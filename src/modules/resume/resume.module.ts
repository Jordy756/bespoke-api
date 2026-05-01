import { CoreModule } from '@core/core.module';
import { GenerateResumeCommand } from '@modules/resume/application/commands/generate-resume.command';
import { ResumeRepository } from '@modules/resume/infrastructure/adapters/repositories/resume.repository';
import { AiResumeService } from '@modules/resume/infrastructure/adapters/services/ai-resume.service';
import { CompressorService } from '@modules/resume/infrastructure/adapters/services/compressor.service';
import { ResumeController } from '@modules/resume/infrastructure/http/controllers/resume.controller';
import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [CoreModule, ProfileModule],
  controllers: [ResumeController],
  providers: [
    GenerateResumeCommand,
    {
      provide: 'IResumeRepository',
      useClass: ResumeRepository,
    },
    {
      provide: 'IProfileCompressorService',
      useClass: CompressorService,
    },
    {
      provide: 'IAiResumeService',
      useClass: AiResumeService,
    },
  ],
})
export class ResumeModule {}
