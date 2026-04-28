import { PrismaService } from '@core/database/prisma.service';
import { User } from '@modules/account/domain/entities/user.entity';
import type { IAccountRepository } from '@modules/account/domain/ports/account.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save({ email }: User): Promise<User> {
    const saved = await this.prisma.user.create({
      data: {
        email: email.getValue(),
      },
    });

    return User.reconstruct(saved.id, email, saved.createdAt, saved.updatedAt);
  }
}
