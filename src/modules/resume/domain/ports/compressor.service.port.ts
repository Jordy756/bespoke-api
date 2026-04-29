export interface ICompressorService {
  compress(data: Record<string, any>): string;
  decompress(data: string): Record<string, any>;
}
