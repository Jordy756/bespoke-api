import { AuthProvider } from '@modules/account/domain/enums/auth-provider.enum';
import { SubscriptionPlan } from '@modules/account/domain/enums/subscription-plan.enum';

export class UserResponseDto {
  id!: string;
  email!: string;
  provider!: AuthProvider;
  name?: string;
  avatarUrl?: string;
  plan!: SubscriptionPlan;
  dailyCredits!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
