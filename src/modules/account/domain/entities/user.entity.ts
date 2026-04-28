import { UserEmail } from '@modules/account/domain/value-objects/user-email';
import { AuthProvider } from '@modules/account/domain/enums/auth-provider.enum';
import { SubscriptionPlan } from '@modules/account/domain/enums/subscription-plan.enum';

export interface UserProps {
  id?: string;
  email: UserEmail;
  provider: AuthProvider;
  providerId: string;
  name: string | null;
  avatarUrl: string | null;
  plan: SubscriptionPlan;
  dailyCredits: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id?: string;
  public readonly email: UserEmail;
  public readonly provider: AuthProvider;
  public readonly providerId: string;
  public readonly name: string | null;
  public readonly avatarUrl: string | null;
  public readonly plan: SubscriptionPlan;
  public readonly dailyCredits: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  private constructor(props: UserProps) {
    const { id, email, provider, providerId, name, avatarUrl, plan, dailyCredits, createdAt, updatedAt } = props;

    this.id = id;
    this.email = email;
    this.provider = provider;
    this.providerId = providerId;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.plan = plan;
    this.dailyCredits = dailyCredits;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createNew(
    email: string,
    provider: AuthProvider,
    providerId: string,
    name: string | null = null,
    avatarUrl: string | null = null,
  ): User {
    const userEmail = UserEmail.create(email);

    return new User({
      email: userEmail,
      provider,
      providerId,
      name,
      avatarUrl,
      plan: SubscriptionPlan.FREE,
      dailyCredits: 3,
    });
  }

  static reconstruct(props: UserProps): User {
    return new User(props);
  }
}
