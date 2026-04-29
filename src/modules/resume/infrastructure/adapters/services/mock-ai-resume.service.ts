import { Injectable } from '@nestjs/common';
import { GeneratedResumeResult, IAiResumeService } from '@modules/resume/domain/ports/ai-resume.service.port';

@Injectable()
export class MockAiResumeService implements IAiResumeService {
  async generateTailoredResume(profileToon: string, jobOffer: string): Promise<GeneratedResumeResult> {
    // Mock simulation for network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Log internally for debugging purposes
    console.log('[Mock AI] Received compressed profile:', profileToon);
    console.log('[Mock AI] Tailoring against job offer length:', jobOffer.length);

    // MOCK RESPONSE
    // Return a basic valid TOON string simulation that matches standard Profile fields.
    // In production, this would be an actual API call to OpenAI/Anthropic SDK.
    const mockToonResult = `
      name: "John Doe Tailored"
      skills:
        - "React"
        - "NodeJS"
        - "Tailored AI Skills"
      `.trim();

    return {
      jobTitle: 'Senior Frontend Developer (Tailored)',
      fitScore: 92,
      toonData: mockToonResult,
    };
  }
}
