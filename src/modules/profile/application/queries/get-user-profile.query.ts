import { Profile } from '@modules/profile/domain/entities/profile.entity';
import type { IProfileRepository } from '@modules/profile/domain/ports/profile.repository.port';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetUserProfileQuery {
  constructor(@Inject('IProfileRepository') private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
