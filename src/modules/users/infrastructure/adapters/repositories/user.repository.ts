import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import type { IUserRepository } from '@modules/users/domain/ports/user.repository.port';
import type { User } from '@modules/users/domain/entities/user.entity';
// import { UserEmail } from '@modules/users/domain/value-objects/user-email';
import { UserMapper } from '@modules/users/application/mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistenceModel(user);

    const savedUser = await this.prisma.user.upsert({
      where: { email: persistenceData.email },
      update: persistenceData,
      create: persistenceData,
    });

    return UserMapper.toDomainEntity(savedUser);
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
