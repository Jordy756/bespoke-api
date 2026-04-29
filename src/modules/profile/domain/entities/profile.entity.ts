export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public data: Record<string, any>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  updateData(newData: Record<string, any>): void {
    this.data = { ...this.data, ...newData };
  }

  clearData(): void {
    this.data = {};
  }
}
