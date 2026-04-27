export class UserEmail {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static create(email: string): UserEmail {
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) throw new Error(`Invalid email format: ${email}`);

    return new UserEmail(trimmedEmail);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserEmail): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
