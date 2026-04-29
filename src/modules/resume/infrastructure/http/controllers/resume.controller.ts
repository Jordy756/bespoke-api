import { GenerateResumeCommand } from '@modules/resume/application/commands/generate-resume.command';
import { GenerateResumeDto } from '@modules/resume/application/dtos/generate-resume.dto';
import { ResumeResponseDto } from '@modules/resume/application/dtos/resume-response.dto';
import { ResumeMapper } from '@modules/resume/application/mappers/resume.mapper';
import { Body, Controller, Headers, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';

@Controller('resumes')
export class ResumeController {
  constructor(@Inject(GenerateResumeCommand) private readonly generateResumeCommand: GenerateResumeCommand) {}

  @Post('me/generate')
  @HttpCode(HttpStatus.CREATED)
  async generateResumeForOffer(
    @Headers('x-user-id') userId: string,
    @Body() dto: GenerateResumeDto,
  ): Promise<ResumeResponseDto> {
    const resume = await this.generateResumeCommand.execute(userId, dto.jobOffer);
    return ResumeMapper.toDTO(resume);
  }
}
