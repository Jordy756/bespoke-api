import { CoreModule } from '@core/core.module';
import { AccountModule } from '@modules/account/account.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule, AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
