export interface GeneratedResumeResult {
  jobTitle: string;
  fitScore: number;
  toonData: string;
}

export interface IAiResumeService {
  generateTailoredResume(profileToon: string, jobOffer: string): Promise<GeneratedResumeResult>;
}
