import { PrismaService } from '@core/database/prisma.service';
import { User } from '@modules/users/domain/entities/user.entity';
import type { IUserRepository } from '@modules/users/domain/ports/user.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
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
