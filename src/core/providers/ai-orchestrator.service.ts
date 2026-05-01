import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AiGenerationOptions {
  jsonMode?: boolean;
  temperature?: number;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateContent(systemPrompt: string, userPrompt: string, options?: AiGenerationOptions): Promise<string> {
    const errors: Error[] = [];

    const providers = [
      { name: 'Gemini', call: () => this.callGemini(systemPrompt, userPrompt, options) },
      { name: 'OpenAI', call: () => this.callOpenAI(systemPrompt, userPrompt, options) },
    ];

    for (const provider of providers) {
      try {
        this.logger.log(`Trying ${provider.name}...`);
        return await provider.call();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.warn(`${provider.name} failed: ${errorMessage}`);
        errors.push(error instanceof Error ? error : new Error(errorMessage));
      }
    }

    throw new InternalServerErrorException('All AI providers failed to generate a response');
  }

  private async callGemini(systemPrompt: string, userPrompt: string, options?: AiGenerationOptions): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const generationConfig: Record<string, string | number> = {
      temperature: options?.temperature ?? 0.2,
    };

    if (options?.jsonMode) {
      generationConfig.responseMimeType = 'application/json';
    }

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig,
    };

    const response = await this.fetchApi<GeminiResponse>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return response.candidates[0].content.parts[0].text;
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string, options?: AiGenerationOptions): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

    const url = 'https://api.openai.com/v1/chat/completions';

    const body: Record<string, unknown> = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.2,
    };

    if (options?.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const response = await this.fetchApi<OpenAIResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    return response.choices[0].message.content;
  }

  private async fetchApi<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, init);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error (${response.status}): ${errorData}`);
    }

    return response.json() as Promise<T>;
  }
}
