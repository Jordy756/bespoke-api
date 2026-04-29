import { CoreModule } from '@core/core.module';
import { ResumeController } from '@modules/resume/infrastructure/http/controllers/resume.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [],
  controllers: [ResumeController],
  exports: [],
})
export class ResumeModule {}
