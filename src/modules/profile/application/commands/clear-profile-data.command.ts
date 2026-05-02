import type { IProfileRepository } from '@modules/profile/domain/ports/profile.repository.port';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ClearProfileDataCommand {
  constructor(@Inject('IProfileRepository') private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<void> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    profile.data = {
      basics: { name: '', email: '', phone: '', summary: '', location: '' },
      experience: [],
      education: [],
      certificates: [],
      skills: { frontend: [], backend: [], mobile: [], architecture: [], devops: [], methodologies: [], ia: [], languages: [] },
      projects: []
    };
    await this.profileRepository.save(profile);
  }
}
