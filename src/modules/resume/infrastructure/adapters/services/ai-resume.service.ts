import { AiOrchestratorService } from '@core/providers/ai-orchestrator.service';
import { GeneratedResumeResult, IAiResumeService } from '@modules/resume/domain/ports/ai-resume.service.port';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiResumeService implements IAiResumeService {
  private readonly logger = new Logger(AiResumeService.name);

  constructor(private readonly aiOrchestrator: AiOrchestratorService) {}

  async generateResume(profileDataToon: string, jobOffer: string): Promise<GeneratedResumeResult> {
    this.logger.log('Starting tailored resume generation via orchestrated LLMs...');

    const systemPrompt = `You are an expert ATS-friendly Resume Writer and Career Coach.
      Your task is to analyze the candidate's profile data (provided in TOON format, a highly compressed tabular format) and tailor it to match the provided job offer.

      CRITICAL REQUIREMENT:
      You MUST output the result as a valid JSON object ONLY. Do not use Markdown blocks (no \`\`\`json), just the raw JSON object.
      The JSON must strictly match this structure:
      {
        "jobTitle": "The tailored professional title for the candidate",
        "fitScore": <number between 0 and 100>,
        "resumeData": <The tailored resume data structured as an object matching standard JSON format>
    }`;

    const userPrompt = `[JOB OFFER]
${jobOffer}

[CANDIDATE PROFILE (TOON format)]
${profileDataToon}

Analyze the profile against the job offer, select the most relevant experience and skills, format it appropriately, and return the tailored output in strict JSON format.`;

    try {
      const jsonResponse = await this.aiOrchestrator.generate({
        system: systemPrompt,
        prompt: userPrompt,
      });

      console.log({ rawJsonResponse: jsonResponse });

      return {
        jobTitle: 'AI-Generated Job Title',
        fitScore: 85,
        data: jsonResponse,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to generate tailored resume: ${errorMessage}`);
      throw new Error('Failed to tailor resume using AI. Please try again later.', { cause: error });
    }
  }
}
