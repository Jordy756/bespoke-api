/**
 * UsersController
 *
 * PUNTO DE ENTRADA HTTP.
 * Responsabilidades (y SOLO estas):
 *
 * 1. Recibir el request HTTP (body, params, query)
 * 2. Validar el request (ValidationPipe lo hace automáticamente con DTOs)
 * 3. Convertir el request a un Comando (Application)
 * 4. Despachar el comando al handler
 * 5. Capturar excepciones de dominio y convertirlas a HTTP responses
 * 6. Retornar la respuesta
 *
 * ¿Qué NO hace aquí?
 * - Lógica de negocio ❌
 * - Consultas a DB ❌
 * - Transformaciones de datos complejas ❌
 * - Validaciones de negocio ❌
 *
 * Controllers delgados → Aplicación fuerte
 * Controllers gordos → Código espagueti
 *
 * Rutas:
 * - POST /auth/register → register()
 *
 * Excepciones esperadas:
 * - UserAlreadyExistsException → HTTP 409 Conflict
 * - (Otras excepciones de validación → HTTP 400 Bad Request, manejado por ValidationPipe)
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { UserResponseDto } from '../../../application/dtos/user-response.dto';
import { UserMapper } from '../../../application/mappers/user.mapper';
import { RegisterUserCommandHandler } from '../../../application/commands/register-user.command-handler';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';

/**
 * ¿Por qué inyectamos el Handler y no lo creamos con `new`?
 * - Inyección de dependencias: Si el Handler tiene dependencias, NestJS las resuelve
 * - Testeable: Podemos hacer mock del handler en tests
 * - Singleton: NestJS asegura una única instancia (eficiente)
 */

@Controller('auth')
export class UsersController {
  constructor(
    @Inject(RegisterUserCommandHandler)
    private readonly registerUserCommandHandler: RegisterUserCommandHandler,
  ) {}

  /**
   * POST /auth/register
   *
   * Registra un nuevo usuario en el sistema.
   *
   * Request:
   * {
   *   "email": "user@example.com",
   *   "password": "SecurePass123",
   *   "name": "John Doe"
   * }
   *
   * Response (201 Created):
   * {
   *   "id": "uuid-here",
   *   "email": "user@example.com",
   *   "name": "John Doe",
   *   "credits": 10,
   *   "createdAt": "2026-04-22T...",
   *   "updatedAt": "2026-04-22T..."
   * }
   *
   * Error (409 Conflict):
   * {
   *   "statusCode": 409,
   *   "message": "User with email \"user@example.com\" already exists",
   *   "error": "Conflict"
   * }
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // 1️⃣ Mapear DTO → Comando
      const command = UserMapper.toRegisterCommand(createUserDto);

      // 2️⃣ Ejecutar el handler (todo el negocio pasa acá)
      const result = await this.registerUserCommandHandler.execute(command);

      // 3️⃣ Retornar DTO de respuesta
      return result;
    } catch (error) {
      // 4️⃣ Capturar excepciones de dominio y convertirlas a HTTP

      if (error instanceof UserAlreadyExistsException) {
        // Excepción de negocio → HTTP 409 Conflict
        throw new ConflictException(error.message);
      }

      if (error instanceof Error && error.message.includes('Invalid')) {
        // Excepción de validación de Value Object → HTTP 400 Bad Request
        throw new BadRequestException(error.message);
      }

      // Cualquier otra excepción, re-lanzar (será capturada por global exception filter)
      throw error;
    }
  }
}
