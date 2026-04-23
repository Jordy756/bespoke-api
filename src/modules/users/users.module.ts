/**
 * UsersModule
 *
 * INYECCIÓN DE DEPENDENCIAS.
 * Aquí conectamos todas las piezas del rompecabezas.
 *
 * Responsabilidades:
 * 1. Declarar los Providers (servicios, handlers, adapters)
 * 2. Exportar lo que otros módulos necesiten
 * 3. Importar servicios globales (PrismaService, etc)
 * 4. Definir los contratos (tokens) entre abstracción e implementación
 *
 * ¿Cómo funciona la inyección hexagonal?
 *
 * El Handler dice: "Necesito un IUserRepository"
 * NestJS busca un provider con token 'IUserRepository'
 * El módulo define: token 'IUserRepository' → implementación PrismaUserRepository
 * NestJS inyecta PrismaUserRepository cuando el Handler lo pide
 *
 * DIAGRAM:
 * UsersModule
 * ├── Providers (clases disponibles)
 * │   ├── RegisterUserCommandHandler (lógica de negocio)
 * │   ├── PrismaUserRepository (implementa IUserRepository)
 * │   └── UsersController (HTTP layer)
 * ├── Controllers (rutas HTTP)
 * │   └── UsersController
 * └── Imports (módulos externos)
 *     └── CoreModule (PrismaService)
 */

import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { UsersController } from '@modules/users/infrastructure/http/controllers/users.controller';
import { RegisterUserCommandHandler } from '@modules/users/application/commands/register-user.command-handler';
import { PrismaUserRepository } from '@modules/users/infrastructure/adapters/repositories/prisma-user.repository';

@Module({
  /**
   * CoreModule: Importamos para acceder a PrismaService (base de datos)
   */
  imports: [CoreModule],

  /**
   * Providers: Todas las clases e inyectables disponibles en este módulo
   */
  providers: [
    // Command Handlers
    RegisterUserCommandHandler,

    // Adapters (Implementaciones concretas de Ports)
    PrismaUserRepository,

    /**
     * INYECCIÓN HEXAGONAL: Mapeo de abstracción → implementación
     *
     * Cuando un Handler pide 'IPasswordHasher',
     */
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],

  /**
   * Controllers: Las rutas HTTP de este módulo
   */
  controllers: [UsersController],

  /**
   * Exports: Lo que otros módulos pueden usar de este módulo
   * Por ahora, nada. Pero si otros módulos necesitan RegisterUserCommandHandler,
   * lo exportaríamos aquí.
   */
  exports: [],
})
export class UsersModule {}
