/**
 * CreateUserDto
 *
 * Data Transfer Object para ENTRADA.
 * Cuando el cliente hace POST /auth/register, su JSON se valida contra este DTO.
 *
 * ¿Qué logra?
 * 1. Validación de tipos (TypeScript compile-time)
 * 2. Validación de valores en tiempo de ejecución (class-validator)
 * 3. Transformación automática (class-transformer)
 * 4. Documentación para OpenAPI/Swagger
 *
 * ¿Por qué es diferente de UserEmail/UserPassword?
 * - El DTO es lo que ENTRA desde HTTP (strings, nulls, undefined, etc)
 * - Las Value Objects son lo que EXISTE en dominio (validados, seguros)
 * - El Mapper traduce uno al otro
 */

import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  password!: string;

  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;
}
