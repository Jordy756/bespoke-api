import { Profile } from '@modules/profile/domain/entities/profile.entity';
import type { IProfileRepository } from '@modules/profile/domain/ports/profile.repository.port';
import { ConflictException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class InitializeProfileCommand {
  constructor(@Inject('IProfileRepository') private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string, initialData: Record<string, any>): Promise<Profile> {
    const existing = await this.profileRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictException('Profile already initialized for this user');
    }

    const profile = new Profile(crypto.randomUUID(), userId, initialData || {}, new Date(), new Date());

    return await this.profileRepository.save(profile);
  }
}
