import { Profile } from '@modules/profile/domain/entities/profile.entity';
import type { IProfileRepository } from '@modules/profile/domain/ports/profile.repository.port';
import { ConflictException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class InitializeProfileCommand {
  constructor(@Inject('IProfileRepository') private readonly profileRepository: IProfileRepository) {}

  async execute(profile: Profile): Promise<Profile> {
    const existing = await this.profileRepository.findByUserId(profile.userId);

    if (existing) throw new ConflictException('Profile already initialized for this user');

    return await this.profileRepository.save(profile);
  }
}
