/**
 * UserResponseDto
 *
 * Data Transfer Object para SALIDA.
 * Cuando respondemos al cliente, lo hacemos con este DTO.
 *
 * ¿Qué es seguro incluir aquí?
 * - id: El UUID del usuario ✅
 * - email: El email (no secreto) ✅
 * - name: El nombre (no secreto) ✅
 * - credits: El saldo de créditos (información de la cuenta) ✅
 * - createdAt: Metadata (no secreto) ✅
 *
 * ¿Qué JAMÁS incluimos?
 * - password: Nunca retornamos passwords, ni hasheadas ❌
 * - authProvider: Metadata interna (implementar después) ❌
 * - profileData: Información privada (serializar solo lo necesario) ❌
 *
 * class-transformer @Expose() / @Exclude() controla exactamente esto.
 */

import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  name?: string;

  @Expose()
  credits!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
