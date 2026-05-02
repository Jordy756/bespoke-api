import { ClearProfileDataCommand } from '@modules/profile/application/commands/clear-profile-data.command';
import { InitializeProfileCommand } from '@modules/profile/application/commands/initialize-profile.command';
import { UpdateProfileDataCommand } from '@modules/profile/application/commands/update-profile-data.command';
import { InitializeProfileDto } from '@modules/profile/application/dtos/initialize-profile.dto';
import { ProfileResponseDto } from '@modules/profile/application/dtos/profile-response.dto';
import { UpdateProfileDataDto } from '@modules/profile/application/dtos/update-profile-data.dto';
import { ProfileMapper } from '@modules/profile/application/mappers/profile.mapper';
import { GetUserProfileQuery } from '@modules/profile/application/queries/get-user-profile.query';
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Inject, Patch, Post } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(
    @Inject(InitializeProfileCommand) private readonly initializeProfileCommand: InitializeProfileCommand,
    @Inject(UpdateProfileDataCommand) private readonly updateProfileDataCommand: UpdateProfileDataCommand,
    @Inject(ClearProfileDataCommand) private readonly clearProfileDataCommand: ClearProfileDataCommand,
    @Inject(GetUserProfileQuery) private readonly getUserProfileQuery: GetUserProfileQuery,
  ) {}

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  async initializeProfile(
    @Headers('x-user-id') userId: string, // TODO: Replace with @CurrentUser() from JWT Guard
    @Body() dto: InitializeProfileDto,
  ): Promise<ProfileResponseDto> {
    const profileEntity = ProfileMapper.toInitializeEntity(userId, dto);
    const result = await this.initializeProfileCommand.execute(profileEntity);
    return ProfileMapper.toDTO(result);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfileDetails(
    @Headers('x-user-id') userId: string, // TODO: Replace with @CurrentUser() from JWT Guard
  ): Promise<ProfileResponseDto> {
    const profile = await this.getUserProfileQuery.execute(userId);
    return ProfileMapper.toDTO(profile);
  }

  @Patch('me/data')
  @HttpCode(HttpStatus.OK)
  async partiallyUpdateProfileData(
    @Headers('x-user-id') userId: string, // TODO: Replace with @CurrentUser() from JWT Guard
    @Body() dto: UpdateProfileDataDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.updateProfileDataCommand.execute(userId, dto.data);
    return ProfileMapper.toDTO(profile);
  }

  @Delete('me/data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async purgeProfileData(
    @Headers('x-user-id') userId: string, // TODO: Replace with @CurrentUser() from JWT Guard
  ): Promise<void> {
    await this.clearProfileDataCommand.execute(userId);
  }
}
