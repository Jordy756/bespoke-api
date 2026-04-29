import { ICompressorService } from '@modules/resume/domain/ports/compressor.service.port';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { decode, encode, type JsonValue } from '@toon-format/toon';

@Injectable()
export class ToonCompressorService implements ICompressorService {
  compress(jsonData: Record<string, any>): string {
    try {
      return encode(jsonData);
    } catch (error) {
      console.error('Compression error:', error);
      throw new InternalServerErrorException('Failed to compress profile data');
    }
  }

  decompress(toonData: string): JsonValue {
    try {
      return decode(toonData);
    } catch (error) {
      console.error('Decompression error:', error);
      throw new InternalServerErrorException('Failed to decompress profile data from AI');
    }
  }
}
