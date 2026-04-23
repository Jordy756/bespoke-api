/**
 * UserPort - Repository Port (Interface)
 *
 * Define el CONTRATO que cualquier persistencia debe cumplir.
 * El dominio NO sabe si usas Prisma, MongoDB, MySQL, etc.
 * Solo sabe: "Necesito guardar un User y buscar por email".
 *
 * Esta es la inyección de dependencias "hacia adentro".
 * La infraestructura implementa este contrato.
 */

import type { User } from '../entities/user.entity';
import type { UserEmail } from '../value-objects/user-email';

export interface IUserRepository {
  /**
   * Guardar un nuevo usuario en la persistencia.
   * Retorna el usuario persistido (con ID, timestamps, etc).
   */
  save(user: User): Promise<User>;

  /**
   * Buscar un usuario por su email.
   * Retorna el usuario si existe, undefined si no existe.
   */
  findByEmail(email: UserEmail): Promise<User | undefined>;

  /**
   * Buscar un usuario por su ID.
   * Usado para consultas y para verificar existencia.
   */
  findById(id: string): Promise<User | undefined>;
}
