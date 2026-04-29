import { ClearProfileDataCommand } from '@modules/profile/application/commands/clear-profile-data.command';
import { InitializeProfileCommand } from '@modules/profile/application/commands/initialize-profile.command';
import { UpdateProfileDataCommand } from '@modules/profile/application/commands/update-profile-data.command';
import { InitializeProfileDto } from '@modules/profile/application/dtos/initialize-profile.dto';
import { ProfileResponseDto } from '@modules/profile/application/dtos/profile-response.dto';
import { UpdateProfileDataDto } from '@modules/profile/application/dtos/update-profile-data.dto';
import { ProfileMapper } from '@modules/profile/application/mappers/profile.mapper';
import { GetUserProfileQuery } from '@modules/profile/application/queries/get-user-profile.query';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(
    @Inject(InitializeProfileCommand) private readonly initializeProfileCommand: InitializeProfileCommand,
    @Inject(UpdateProfileDataCommand) private readonly updateProfileDataCommand: UpdateProfileDataCommand,
    @Inject(ClearProfileDataCommand) private readonly clearProfileDataCommand: ClearProfileDataCommand,
    @Inject(GetUserProfileQuery) private readonly getUserProfileQuery: GetUserProfileQuery,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async setupProfile(@Body() dto: InitializeProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.initializeProfileCommand.execute(dto.userId, dto.data || {});
    return ProfileMapper.toDTO(profile);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Param('userId') userId: string): Promise<ProfileResponseDto> {
    const profile = await this.getUserProfileQuery.execute(userId);
    return ProfileMapper.toDTO(profile);
  }

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  async updateData(@Param('userId') userId: string, @Body() dto: UpdateProfileDataDto): Promise<ProfileResponseDto> {
    const profile = await this.updateProfileDataCommand.execute(userId, dto.data);
    return ProfileMapper.toDTO(profile);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearData(@Param('userId') userId: string): Promise<void> {
    await this.clearProfileDataCommand.execute(userId);
  }
}
