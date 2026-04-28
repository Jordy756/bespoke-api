import { CoreModule } from '@core/core.module';
import { LoginUserCommand } from '@modules/account/application/commands/login-user.command';
import { RegisterUserCommand } from '@modules/account/application/commands/register-user.command';
import { AccountRepository } from '@modules/account/infrastructure/adapters/repositories/account.repository';
import { AccountController } from '@modules/account/infrastructure/http/controllers/account.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [
    RegisterUserCommand,
    LoginUserCommand,
    AccountRepository,
    {
      provide: 'IAccountRepository',
      useClass: AccountRepository,
    },
  ],
  controllers: [AccountController],
  exports: [],
})
export class AccountModule {}
