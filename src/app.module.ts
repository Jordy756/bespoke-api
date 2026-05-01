import { validateEnv } from '@core/config/environment.config';
import { CoreModule } from '@core/core.module';
import { AccountModule } from '@modules/account/account.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { ResumeModule } from '@modules/resume/resume.module';
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
    ResumeModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
