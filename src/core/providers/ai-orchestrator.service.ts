import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { CallSettings, Prompt } from 'ai';
import { generateText } from 'ai';

type GenerateTextParams = CallSettings & Prompt;

@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);

  async generateTextContent(options: GenerateTextParams): Promise<string> {
    try {
      this.logger.log('Generating content via Vercel AI SDK...');

      const { text } = await generateText({
        ...options,
        model: 'zai/glm-4.6v-flash',
        temperature: options.temperature ?? 0.2,
      });

      return text;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`AI SDK Generation failed: ${errorMessage}`);
      throw new InternalServerErrorException('Failed to generate response using AI Gateway');
    }
  }
}
