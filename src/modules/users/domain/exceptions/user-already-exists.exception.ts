/**
 * UserAlreadyExistsException
 *
 * Excepción de dominio que se lanza cuando se intenta registrar
 * un usuario con un email que ya existe en el sistema.
 *
 * Esta es una excepción PURA de dominio, sin dependencias de NestJS ni HTTP.
 * Después, en infrastructure/http, NestJS la convierte a HTTP 409 Conflict.
 */

export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}
