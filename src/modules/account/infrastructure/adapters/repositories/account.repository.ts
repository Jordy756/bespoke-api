import { PrismaService } from '@core/database/prisma.service';
import { User } from '@modules/account/domain/entities/user.entity';
import type { IAccountRepository } from '@modules/account/domain/ports/account.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
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
}
