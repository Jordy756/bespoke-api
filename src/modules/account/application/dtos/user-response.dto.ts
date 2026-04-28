import { Expose } from 'class-transformer';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { SubscriptionPlan } from '../../domain/enums/subscription-plan.enum';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  provider!: AuthProvider;

  @Expose()
  name?: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  plan!: SubscriptionPlan;

  @Expose()
  dailyCredits!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
