import { PrismaService } from '@core/database/prisma.service';
import { UserMapper } from '@modules/account/application/mappers/user.mapper';
import { User } from '@modules/account/domain/entities/user.entity';
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

    return UserMapper.toDomain(saved);
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return user ? UserMapper.toDomain(user) : null;
  }
}
