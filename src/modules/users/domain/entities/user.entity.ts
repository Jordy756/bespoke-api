export class User {
  constructor(
    public id: string | undefined, // will be set by the DB after insert
    public email: string,
    public authProvider: string,
    public credits: number,
    public createdAt: Date | undefined, // set by the DB on insert
    public updatedAt: Date | undefined, // set by the DB on insert / update
    public name?: string,
    public profileData?: Record<string, unknown>,
  ) {}
}
