import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';
import { ClearProfileDataCommand } from './application/commands/clear-profile-data.command';
import { InitializeProfileCommand } from './application/commands/initialize-profile.command';
import { UpdateProfileDataCommand } from './application/commands/update-profile-data.command';
import { GetUserProfileQuery } from './application/queries/get-user-profile.query';
import { ProfileRepository } from './infrastructure/adapters/repositories/profile.repository';
import { ProfileController } from './infrastructure/http/controllers/profile.controller';

@Module({
  imports: [CoreModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    InitializeProfileCommand,
    UpdateProfileDataCommand,
    ClearProfileDataCommand,
    GetUserProfileQuery,
  ],
  exports: ['IProfileRepository'],
})
export class ProfileModule {}
