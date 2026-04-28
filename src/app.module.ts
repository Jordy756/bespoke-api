import { CoreModule } from '@core/core.module';
import { validateEnv } from '@core/config/environment.config';
import { AccountModule } from '@modules/account/account.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CoreModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
