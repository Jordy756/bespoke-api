import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { UsersController } from '@modules/users/infrastructure/http/controllers/users.controller';
import { RegisterUserCommand } from '@modules/users/application/commands/register-user.command';
import { UserRepository } from '@modules/users/infrastructure/adapters/repositories/user.repository';

@Module({
  imports: [CoreModule],
  providers: [
    RegisterUserCommand,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
