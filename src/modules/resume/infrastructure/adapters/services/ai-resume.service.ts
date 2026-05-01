import { Injectable, Logger } from '@nestjs/common';
import { GeneratedResumeResult, IAiResumeService } from '@modules/resume/domain/ports/ai-resume.service.port';
import { AiOrchestratorService } from '@core/providers/ai-orchestrator.service';

@Injectable()
export class AiResumeService implements IAiResumeService {
  private readonly logger = new Logger(AiResumeService.name);

  constructor(private readonly aiOrchestrator: AiOrchestratorService) {}

  async generateTailoredResume(profileDataToon: string, jobOffer: string): Promise<GeneratedResumeResult> {
    this.logger.log('Starting tailored resume generation via orchestrated LLMs...');

    // We construct a specific system prompt containing rules for JSON output
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
      // Call the domain-agnostic orchestrator asking specifically for JSON
      const rawJsonResponse = await this.aiOrchestrator.generateContent(systemPrompt, userPrompt, { jsonMode: true });

      // We parse the JSON output natively since we asked the LLM to use JSON
      const parsedData = JSON.parse(rawJsonResponse);

      // We stringify the tailored resume data payload as expected by the domain
      const resumeJsonString = JSON.stringify(parsedData.resumeData || parsedData);

      return {
        jobTitle: parsedData.jobTitle || 'Tailored Resume',
        fitScore: parsedData.fitScore || 85,
        toonData: resumeJsonString, // This holds JSON string now, you may rename toonData to resumeData in domain later
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to generate tailored resume: ${errorMessage}`);
      throw new Error('Failed to tailor resume using AI. Please try again later.');
    }
  }
}
