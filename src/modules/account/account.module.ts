import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { AccountController } from '@modules/account/infrastructure/http/controllers/account.controller';
import { RegisterUserCommand } from '@modules/account/application/commands/register-user.command';
import { AccountRepository } from '@modules/account/infrastructure/adapters/repositories/account.repository';

@Module({
  imports: [CoreModule],
  providers: [
    RegisterUserCommand,
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
