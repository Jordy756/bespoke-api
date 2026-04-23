/**
 * User - Entity (Rich Domain Object)
 *
 * Una entidad NO es un simple POJO (Plain Old JavaScript Object).
 * Es un objeto RICO con comportamiento e invariantes de negocio.
 *
 * Responsabilidades:
 * 1. Encapsular datos relacionados (email, password, créditos, etc)
 * 2. Validar invariantes de negocio (un usuario siempre tiene email válido)
 * 3. NO conocer cómo se persiste (sin @Entity decorators, sin Prisma, etc)
 * 4. Ser testeable sin mock (solo new User(...))
 *
 * ¿Por qué el constructor es private?
 * - Fuerza usar el factory method `create()` que valida reglas de negocio.
 * - Evita crear entidades en estado inválido.
 */

import { UserEmail } from '../value-objects/user-email';
import { UserPassword } from '../value-objects/user-password';

export class User {
  private constructor(
    public readonly id: string | undefined, // undefined hasta que se persista
    public readonly email: UserEmail,
    public readonly password: UserPassword,
    public credits: number,
    public readonly name?: string,
    public readonly profileData?: Record<string, unknown>,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Factory Method: Crea un nuevo usuario (durante registro).
   * Valida todas las reglas de negocio antes de permitir la creación.
   */
  static createNew(email: UserEmail, password: UserPassword, name?: string): User {
    // Validación de invariantes de negocio
    if (!email) {
      throw new Error('Email is required');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    // Un usuario nuevo siempre comienza con 10 créditos (política de negocio)
    const initialCredits = 10;

    return new User(
      undefined, // No tiene ID hasta que se persista
      email,
      password,
      initialCredits,
      name,
    );
  }

  /**
   * Factory Method: Reconstruye un usuario desde la persistencia.
   * Se usa cuando traemos datos de la DB.
   */
  static reconstruct(
    id: string,
    email: UserEmail,
    password: UserPassword,
    credits: number,
    name?: string,
    profileData?: Record<string, unknown>,
    createdAt?: Date,
    updatedAt?: Date,
  ): User {
    return new User(id, email, password, credits, name, profileData, createdAt, updatedAt);
  }

  /**
   * Método de negocio: Deducir créditos cuando se genera un CV.
   * Valida que tenga créditos suficientes.
   */
  deductCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deduction amount must be positive');
    }

    if (this.credits < amount) {
      throw new Error('Insufficient credits');
    }

    // En arquitectura real, usarías un value object para Credits también
    // Aquí simplificamos por brevedad
    this.credits -= amount;
  }

  /**
   * Método de negocio: Verificar si el usuario tiene créditos suficientes.
   */
  hasEnoughCredits(amount: number): boolean {
    return this.credits >= amount;
  }

  /**
   * Método de negocio: Otorgar créditos (promociones, etc).
   */
  addCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Added amount must be positive');
    }
    this.credits += amount;
  }
}
