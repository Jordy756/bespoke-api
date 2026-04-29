import type { JsonValue } from '@toon-format/toon';

export interface ICompressorService {
  compress(jsonData: Record<string, any>): string;
  decompress(toonData: string): JsonValue;
}
