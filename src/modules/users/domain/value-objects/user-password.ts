/**
 * UserPassword - Value Object
 *
 * Encapsula la lógica de hasheo y validación de contraseñas.
 * NUNCA almacenamos passwords en plain text. Siempre hasheadas.
 *
 * En dominio, el password es un objeto de valor inmutable.
 * La lógica de hashing se inyecta desde infrastructure (bcrypt, argon2, etc).
 */

export interface IPasswordHasher {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export class UserPassword {
  private constructor(
    private readonly hashedValue: string,
    private readonly plainValue?: string, // Usado solo durante creación, nunca almacenado
  ) {}

  /**
   * Factory: Crea una contraseña HASHEADA.
   * Usado cuando ya venimos de una contraseña hasheada (desde DB).
   */
  static createFromHash(hashedPassword: string): UserPassword {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new Error('Hashed password cannot be empty');
    }
    return new UserPassword(hashedPassword);
  }

  /**
   * Factory: Crea una contraseña desde plain text (durante registro).
   * Interno: guarda el plain para posterior hasheo en infrastructure.
   */
  static createFromPlain(plainPassword: string): UserPassword {
    if (plainPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(plainPassword)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(plainPassword)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(plainPassword)) {
      throw new Error('Password must contain at least one number');
    }
    return new UserPassword('', plainPassword);
  }

  /**
   * Getter: Retorna el password plain si está disponible (durante creación).
   * Usado en Command para delegar hasheo a infrastructure.
   */
  getPlain(): string | undefined {
    return this.plainValue;
  }

  /**
   * Getter: Retorna el password hasheado.
   * Usado para persistir en DB.
   */
  getHashed(): string {
    return this.hashedValue;
  }

  /**
   * Verifica si este objeto tiene plain text disponible (es una contraseña nueva).
   */
  isNew(): boolean {
    return this.plainValue !== undefined;
  }
}
