/**
 * UserMapper
 *
 * El TRADUCTOR entre capas.
 *
 * Responsabilidades:
 * 1. User Entity (dominio) ←→ UserResponseDto (HTTP response)
 * 2. CreateUserDto (HTTP request) ←→ RegisterUserCommand (application)
 * 3. User Entity ←→ UserPersistence (DB model from Prisma)
 *
 * ¿Por qué necesitamos mappers?
 * - Desacoplamiento: La entidad de dominio NO sabe cómo serializar a JSON
 * - Seguridad: El mapper controla exactamente qué datos exponemos
 * - Flexibilidad: Si cambia el DTO, la entidad de dominio permanece intacta
 * - Testing: Puedes testear mappers por separado
 *
 * Regla de Oro: Mappers no contienen lógica de negocio.
 * Solo transforman datos de un formato a otro.
 */

import { plainToInstance } from 'class-transformer';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RegisterUserCommand } from '../commands/register-user.command';

export class UserMapper {
  /**
   * Transforma una Entidad User al DTO de respuesta HTTP.
   *
   * ¿Qué ocurre aquí?
   * 1. Creamos una instancia de UserResponseDto
   * 2. Asignamos solo los campos que queremos exponer
   * 3. Retornamos (sin password, sin authProvider, etc)
   *
   * Nota: class-transformer podría hacer esto automáticamente si la entidad
   * tuviera decoradores @Expose(), pero los evitamos en el dominio
   * para mantenerlo puro (sin dependencias de librerías).
   */
  static toResponseDto(user: User): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id!;
    response.email = user['email'].getValue(); // UserEmail es un value object, extrae el valor primitivo
    response.name = user.name;
    response.credits = user.credits;
    response.createdAt = user['createdAt'] || new Date();
    response.updatedAt = user['updatedAt'] || new Date();

    return plainToInstance(UserResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Transforma el DTO de entrada HTTP al Comando de aplicación.
   *
   * Este es el primer punto de entrada de datos desde HTTP.
   * Aquí convertimos el request body en una estructura de aplicación.
   */
  static toRegisterCommand(createUserDto: CreateUserDto): RegisterUserCommand {
    return new RegisterUserCommand(createUserDto.email, createUserDto.password, createUserDto.name);
  }

  /**
   * Mapea desde el Modelo de Persistencia (Prisma) a la Entidad de Dominio.
   *
   * Prisma retorna un objeto plano. Aquí lo convertimos a una entidad RICA
   * que tiene comportamiento (métodos de negocio).
   *
   * Parámetro: userPersistence tiene la estructura de Prisma
   * Retorna: User entity rica con métodos
   */
  static toDomainEntity(userPersistence: any): User {
    const { UserEmail } = require('../../domain/value-objects/user-email');
    const { UserPassword } = require('../../domain/value-objects/user-password');

    const email = UserEmail.create(userPersistence.email);
    const password = UserPassword.createFromHash(userPersistence.password);

    return User.reconstruct(
      userPersistence.id,
      email,
      password,
      userPersistence.credits,
      userPersistence.name,
      userPersistence.profileData,
      userPersistence.createdAt,
      userPersistence.updatedAt,
    );
  }

  /**
   * Mapea desde la Entidad de Dominio al Modelo de Persistencia.
   *
   * Este mapeo se usa justo antes de guardar en la base de datos.
   * Prisma espera un objeto plano con campos primitivos.
   * Aquí extraemos los valores de los Value Objects y retornamos lo que Prisma espera.
   */
  static toPersistenceModel(user: User): any {
    return {
      email: user['email'].getValue(),
      password: user['password'].getHashed(),
      credits: user.credits,
      name: user.name || null,
      profileData: user['profileData'] || null,
      // id, createdAt, updatedAt son generados por la BD
    };
  }
}
