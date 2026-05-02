export interface ProfileBasics {
  name: string;
  email: string;
  phone: string;
  summary: string;
  location: string;
}

export interface ProfileExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface ProfileEducation {
  institution: string;
  area: string;
  startDate: string;
  endDate: string;
}

export interface ProfileCertificate {
  name: string;
  date: string;
  issuer: string;
  outcomes: string[];
}

export interface ProfileSkills {
  frontend: string[];
  backend: string[];
  mobile: string[];
  architecture: string[];
  devops: string[];
  methodologies: string[];
  ia: string[];
  languages: string[];
}

export interface ProfileProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface ProfileData {
  basics: ProfileBasics;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  certificates: ProfileCertificate[];
  skills: ProfileSkills;
  projects: ProfileProject[];
}

export interface ProfileProps {
  id?: string;
  userId: string;
  data: ProfileData;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Profile {
  public readonly id?: string;
  public readonly userId: string;
  public data: ProfileData;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  private constructor(props: ProfileProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.data = props.data;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static createNew(userId: string, data: ProfileData): Profile {
    return new Profile({
      userId,
      data,
    });
  }

  static reconstruct(props: ProfileProps): Profile {
    return new Profile(props);
  }

  updateData(newData: Partial<ProfileData>): void {
    this.data = { ...this.data, ...newData };
  }
}
