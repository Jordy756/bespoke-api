import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { UsersController } from '@modules/users/infrastructure/http/controllers/users.controller';
import { RegisterUserCommand } from '@modules/users/application/commands/register-user.command';
import { PrismaUserRepository } from '@modules/users/infrastructure/adapters/repositories/user.repository';

@Module({
  imports: [CoreModule],

  /**
   * Providers: Todas las clases e inyectables disponibles en este módulo
   */
  providers: [
    RegisterUserCommand,
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
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
