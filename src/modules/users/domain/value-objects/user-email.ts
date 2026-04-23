/**
 * UserEmail - Value Object
 *
 * Encapsula la lógica de validación del email en una capa de dominio.
 * Es immutable y responsable de garantizar que SOLO emails válidos existan en el sistema.
 *
 * ¿Por qué un Value Object y no un string?
 * - Tipo seguro: No puedes pasar cualquier string como email. TypeScript te obliga a usar UserEmail.
 * - Validación centralizada: Todas las reglas de email están aquí.
 * - Reutilizable: Lo usas en Queries, Commands, Events, Entidades, etc.
 */

export class UserEmail {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  /**
   * Factory method: Crea una instancia de UserEmail validando el formato.
   * Si el email es inválido, lanza una excepción.
   */
  static create(email: string): UserEmail {
    const trimmedEmail = email.trim().toLowerCase();

    // Validación simple pero efectiva de RFC 5322 (estándar de emails)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    return new UserEmail(trimmedEmail);
  }

  /**
   * Getter: Retorna el valor primitivo del email.
   * Lo usamos cuando necesitamos pasar el email a Prisma, JSON, etc.
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Equals: Compara dos Value Objects de email.
   * Dos emails son iguales si tienen el mismo valor.
   */
  equals(other: UserEmail): boolean {
    return this.value === other.value;
  }

  /**
   * ToString: Para debugging y logging.
   */
  toString(): string {
    return this.value;
  }
}
