/**
 * PrismaUserRepository
 *
 * Implementación CONCRETA del port IUserRepository.
 * Usa Prisma para comunicarse con PostgreSQL.
 *
 * ¿Por qué está en infrastructure/adapters?
 * - El dominio define el contrato (IUserRepository)
 * - Este archivo lo IMPLEMENTA, concreto, con Prisma
 * - Si mañana quieres cambiar a MongoDB, crearías MongoUserRepository
 * - Ambas implementan el mismo contrato
 *
 * Flujo de datos:
 * 1. Application pide: "Dame el usuario con este email"
 * 2. Adapter (este archivo) consulta Prisma
 * 3. Prisma trae un objeto plano de la DB
 * 4. Adapter mapea el objeto plano a Entity (dominio)
 * 5. Retorna la Entity (RICA, con métodos de negocio)
 *
 * Nunca retornamos el objeto plano de Prisma directamente.
 * Siempre lo mapeamos a una Entidad de Dominio.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import type { User } from '../../domain/entities/user.entity';
import { UserEmail } from '../../domain/value-objects/user-email';
import { UserMapper } from '../../application/mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    // Mapear la entidad de dominio a lo que Prisma espera
    const persistenceData = UserMapper.toPersistenceModel(user);

    // Guardar en la base de datos (INSERT o UPDATE)
    // Si el usuario tiene ID, es UPDATE. Si no lo tiene, es INSERT.
    const savedUser = await this.prisma.user.upsert({
      where: { email: persistenceData.email },
      update: persistenceData,
      create: persistenceData,
    });

    // Mapear de vuelta a Entidad de Dominio (IMPORTANTE: retornamos Entity, no objeto plano)
    return UserMapper.toDomainEntity(savedUser);
  }

  async findByEmail(email: UserEmail): Promise<User | undefined> {
    // Consultar en la BD por email
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    // Si no existe, retornar undefined
    if (!user) {
      return undefined;
    }

    // Si existe, mapear a Entidad de Dominio y retornar
    return UserMapper.toDomainEntity(user);
  }

  async findById(id: string): Promise<User | undefined> {
    // Consultar en la BD por ID
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // Si no existe, retornar undefined
    if (!user) {
      return undefined;
    }

    // Si existe, mapear a Entidad de Dominio
    return UserMapper.toDomainEntity(user);
  }
}
