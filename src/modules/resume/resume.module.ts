import { ResumeController } from '@modules/resume/infrastructure/http/controllers/resume.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ResumeController],
})
export class ResumeModule {}
