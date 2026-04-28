import { PrismaService } from '@core/database/prisma.service';
import { User } from '@modules/account/domain/entities/user.entity';
import type { AuthProvider } from '@modules/account/domain/enums/auth-provider.enum';
import type { SubscriptionPlan } from '@modules/account/domain/enums/subscription-plan.enum';
import type { IAccountRepository } from '@modules/account/domain/ports/account.repository.port';
import type { UserEmail } from '@modules/account/domain/value-objects/user-email';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const saved = await this.prisma.user.create({
      data: {
        email: user.email.getValue(),
        provider: user.provider,
        providerId: user.providerId,
        name: user.name,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        dailyCredits: user.dailyCredits,
      },
    });

    return User.reconstruct({
      id: saved.id,
      email: user.email,
      provider: user.provider,
      providerId: user.providerId,
      name: user.name,
      avatarUrl: user.avatarUrl,
      plan: user.plan,
      dailyCredits: user.dailyCredits,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!user) return null;

    return User.reconstruct({
      id: user.id,
      email,
      provider: user.provider as AuthProvider,
      providerId: user.providerId,
      name: user.name,
      avatarUrl: user.avatarUrl,
      plan: user.plan as SubscriptionPlan,
      dailyCredits: user.dailyCredits,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
