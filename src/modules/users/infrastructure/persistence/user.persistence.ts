/**
 * UserPersistenceModel
 *
 * Modelo DE PERSISTENCIA específico de Prisma.
 * Es lo que Prisma espera insertar en la base de datos.
 *
 * ¿Por qué separarlo de la Entidad de Dominio?
 * - La entidad User es RICA, con métodos de negocio
 * - El modelo Prisma es PLANO, solo datos primitivos
 * - Si cambias tu DB de Prisma a TypeORM, SOLO cambias este archivo
 * - El Dominio permanece intacto
 *
 * Convención en Hexagonal:
 * - Entities: carpeta /domain
 * - Persistence Models: carpeta /infrastructure/persistence
 *
 * Nunca importes desde dominio hacia infrastructure (dependency inversion).
 * Infrastructure puede importar desde dominio, pero NO al revés.
 */

/**
 * UserPersistence
 * Representa exactamente lo que está en la tabla PostgreSQL `users`.
 *
 * Campos:
 * - id: UUID (generado por DB)
 * - email: string unique (validado en dominio)
 * - password: string hasheada (nunca plain)
 * - credits: number (saldo de CVs generables)
 * - name: string | null (opcional)
 * - profileData: JSON | null (datos de perfil, flexible)
 * - createdAt: Date (generada por DB)
 * - updatedAt: Date (generada por DB)
 *
 * Este tipo es usado únicamente en:
 * - PrismaUserRepository (trae datos de DB)
 * - UserMapper.toDomainEntity (convierte Persistence → Domain Entity)
 * - UserMapper.toPersistenceModel (convierte Domain Entity → Persistence)
 */

export type UserPersistence = {
  id: string;
  email: string;
  password: string;
  credits: number;
  name: string | null;
  profileData: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};
