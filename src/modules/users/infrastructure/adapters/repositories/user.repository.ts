import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import type { IUserRepository } from '@modules/users/domain/ports/user.repository.port';
import type { User } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const saved = await this.prisma.user.create({
      data: {
        email: user.email.getValue(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return this.toDomain(saved);
  }

  private toDomain(raw: PrismaUser): User {
    return User.reconstruct(raw.id, UserEmail.create(raw.email), raw.createdAt, raw.updatedAt);
  }

  // async findByEmail(email: UserEmail): Promise<User | undefined> {
  //   // Consultar en la BD por email
  //   const user = await this.prisma.user.findUnique({
  //     where: { email: email.getValue() },
  //   });

  //   // Si no existe, retornar undefined
  //   if (!user) {
  //     return undefined;
  //   }

  //   // Si existe, mapear a Entidad de Dominio y retornar
  //   return UserMapper.toDomainEntity(user);
  // }

  // async findById(id: string): Promise<User | undefined> {
  //   // Consultar en la BD por ID
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });

  //   // Si no existe, retornar undefined
  //   if (!user) {
  //     return undefined;
  //   }

  //   // Si existe, mapear a Entidad de Dominio
  //   return UserMapper.toDomainEntity(user);
  // }
}
