export interface ResumeBasics {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface ResumeExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface ResumeEducation {
  institution: string;
  area: string;
  startDate: string;
  endDate: string;
}

export interface ResumeSkills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  outcome?: string;
}

export interface ResumeCertificate {
  name: string;
  date: string;
  issuer: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkills;
  projects: ResumeProject[];
  certificates: ResumeCertificate[];
}

export interface ResumeProps {
  id?: string;
  userId: string;
  jobTitle: string;
  fitScore: number;
  data: ResumeData;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Resume {
  public readonly id?: string;
  public readonly userId: string;
  public readonly jobTitle: string;
  public readonly fitScore: number;
  public readonly data: ResumeData;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  private constructor(props: ResumeProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.jobTitle = props.jobTitle;
    this.fitScore = props.fitScore;
    this.data = props.data;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static createNew(userId: string, jobTitle: string, fitScore: number, data: ResumeData): Resume {
    return new Resume({ userId, jobTitle, fitScore, data });
  }

  static reconstruct(props: ResumeProps): Resume {
    return new Resume(props);
  }
}
