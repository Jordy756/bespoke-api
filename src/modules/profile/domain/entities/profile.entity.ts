export interface ProfileProps {
  id?: string;
  userId: string;
  data: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Profile {
  public readonly id?: string;
  public readonly userId: string;
  public data: Record<string, any>;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  private constructor(props: ProfileProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.data = props.data;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static createNew(userId: string, data: Record<string, any> = {}): Profile {
    return new Profile({
      userId,
      data,
    });
  }

  static reconstruct(props: ProfileProps): Profile {
    return new Profile(props);
  }

  updateData(newData: Record<string, any>): void {
    this.data = { ...this.data, ...newData };
  }

  clearData(): void {
    this.data = {};
  }
}
