/**
 * RegisterUserCommandHandler
 *
 * El MANEJADOR del comando. Aquí vive toda la lógica de negocio de registro.
 *
 * Responsabilidades:
 * 1. Validar que el email no exista (consulta de persistencia)
 * 2. Crear la contraseña hasheada (delegar a PasswordHasher de infrastructure)
 * 3. Crear la entidad User con las Value Objects
 * 4. Persistir el usuario (delegar a Repository)
 * 5. Retornar un DTO seguro (sin password)
 * 6. Capturar excepciones de dominio y convertirlas a errores HTTP (en el controller)
 *
 * ¿Inyección de Dependencias?
 * - IUserRepository: port para persistencia (implementado en Prisma)
 * - IPasswordHasher: port para hashing (implementado en bcrypt)
 *
 * Estas INTERFACES son el puente hexagonal.
 * La lógica de negocio (esta clase) NO conoce implementaciones concretas.
 */

import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserEmail } from '../../domain/value-objects/user-email';
import { UserPassword, type IPasswordHasher } from '../../domain/value-objects/user-password';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { RegisterUserCommand } from './register-user.command';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class RegisterUserCommandHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserResponseDto> {
    // 1️⃣ Crear Value Object de Email (valida formato)
    const userEmail = UserEmail.create(command.email);

    // 2️⃣ Verificar que el email no exista (invariante de unicidad)
    const existingUser = await this.userRepository.findByEmail(userEmail);
    if (existingUser) {
      throw new UserAlreadyExistsException(userEmail.getValue());
    }

    // 3️⃣ Crear Value Object de Password (valida complejidad, pero NO hashea aún)
    const userPassword = UserPassword.createFromPlain(command.password);

    // 4️⃣ Crear la entidad User (dominio puro)
    const newUser = User.createNew(userEmail, userPassword, command.name);

    // 5️⃣ Hashear la password (delegado a infrastructure)
    const plainPassword = userPassword.getPlain()!;
    const hashedPassword = await this.passwordHasher.hash(plainPassword);

    // 6️⃣ Crear una nueva password hasheada
    const hashedUserPassword = UserPassword.createFromHash(hashedPassword);

    // 7️⃣ Reconstruir el User con la password hasheada (en memoria)
    // Aquí necesitamos un método de "reconstrucción" que actualice la password
    // Por arquitectura limpia, podríamos crear otro factory o usar Object.assign
    // Para simplicidad, usamos reconstruct con los datos actuales
    const userWithHashedPassword = User.reconstruct(
      newUser['id'] || '',
      newUser['email'],
      hashedUserPassword,
      newUser['credits'],
      newUser['name'],
      newUser['profileData'],
    );

    // 8️⃣ Persistir el usuario
    const persistedUser = await this.userRepository.save(userWithHashedPassword);

    // 9️⃣ Mapear a DTO (transformar entidad a respuesta segura)
    return UserMapper.toResponseDto(persistedUser);
  }
}
