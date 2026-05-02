export interface GeneratedResumeResult {
  jobTitle: string;
  fitScore: number;
  data: string;
}

export interface IAiResumeService {
  generateResume(profile: string, jobOffer: string): Promise<GeneratedResumeResult>;
}
