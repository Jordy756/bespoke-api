import { CoreModule } from '@core/core.module';
import { validateEnv } from '@core/config/environment.config';
import { AccountModule } from '@modules/account/account.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResumeModule } from './modules/resume/resume.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CoreModule,
    AccountModule,
    ResumeModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
