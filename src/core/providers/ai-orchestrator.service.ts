import { EnvironmentVariables } from '@core/config/environment.config';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenRouter } from '@openrouter/sdk';

const FREE_MODELS = [
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'google/gemma-3-27b-it:free',
] as const;

interface GenerateOptions {
  prompt: string;
  system: string;
  temperature?: number;
  maxTokens?: number;
}

@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);
  private readonly client: OpenRouter;
  private modelIndex = 0;

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {
    this.client = new OpenRouter({ apiKey: this.config.get<string>('OPENROUTER_API_KEY') });
  }

  async generate(opts: GenerateOptions): Promise<string> {
    const { prompt, system, temperature = 0.2, maxTokens = 4096 } = opts;
    const model = FREE_MODELS[this.modelIndex];

    try {
      const response = await this.client.chat.send({
        chatRequest: {
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
          temperature,
          maxTokens,
        },
      });

      return (response.choices[0]?.message?.content as string) ?? '';
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`OpenRouter error: ${msg}`);

      if (msg.includes('401') || msg.includes('api key')) throw new UnauthorizedException('Invalid API key');
      if (msg.includes('429') || msg.includes('rate limit'))
        throw new InternalServerErrorException('Rate limit exceeded');
      throw new InternalServerErrorException(`AI generation failed: ${msg}`);
    }
  }

  nextModel(): void {
    this.modelIndex = (this.modelIndex + 1) % FREE_MODELS.length;
    this.logger.log(`Model: ${FREE_MODELS[this.modelIndex]}`);
  }
}
