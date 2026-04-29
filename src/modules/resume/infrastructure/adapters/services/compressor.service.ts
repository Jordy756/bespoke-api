import { ICompressorService } from '@modules/resume/domain/ports/compressor.service.port';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { decode, encode } from '@toon-format/toon';

@Injectable()
export class CompressorService implements ICompressorService {
  compress(jsonData: Record<string, any>): string {
    try {
      return encode(jsonData);
    } catch (error) {
      console.error('Compression error:', error);
      throw new InternalServerErrorException('Failed to compress profile data');
    }
  }

  decompress(toonData: string): Record<string, any> {
    try {
      return decode(toonData) as Record<string, any>;
    } catch (error) {
      console.error('Decompression error:', error);
      throw new InternalServerErrorException('Failed to decompress profile data from AI');
    }
  }
}
