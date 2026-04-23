/**
 * RegisterUserCommand
 *
 * Un comando es una ORDEN: "Registra este usuario".
 * Es un DTO de entrada que encapsula TODOS los datos necesarios
 * para ejecutar la acción de registro.
 *
 * ¿Por qué una clase y no un objeto plano?
 * - Validación de tipos en tiempo de compilación
 * - Métodos de negocio si es necesario
 * - Constructor strict (en TS estricto)
 * - Reutilizable en tests y mocks
 *
 * Flujo:
 * 1. Controller recibe JSON del cliente
 * 2. Controller lo convierte en RegisterUserCommand (validado)
 * 3. Controller lo envía a RegisterUserCommandHandler
 * 4. Handler ejecuta la lógica de registro
 */

export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name?: string,
  ) {}
}
