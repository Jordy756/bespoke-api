export interface ResumeProps {
  id?: string;
  userId: string;
  jobTitle: string;
  fitScore: number;
  data: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Resume {
  public readonly id?: string;
  public readonly userId: string;
  public readonly jobTitle: string;
  public readonly fitScore: number;
  public readonly data: Record<string, any>;
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

  static createNew(userId: string, jobTitle: string, fitScore: number, data: Record<string, any>): Resume {
    return new Resume({
      userId,
      jobTitle,
      fitScore,
      data,
    });
  }

  static reconstruct(props: ResumeProps): Resume {
    return new Resume(props);
  }
}
