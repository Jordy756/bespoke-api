import { PrismaService } from '@core/database/prisma.service';
import { ProfileMapper } from '@modules/profile/application/mappers/profile.mapper';
import { Profile } from '@modules/profile/domain/entities/profile.entity';
import type { IProfileRepository } from '@modules/profile/domain/ports/profile.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: Profile): Promise<Profile> {
    const { userId, data } = profile;
    const saved = await this.prisma.profile.upsert({
      where: { userId },
      update: { data },
      create: {
        userId,
        data,
      },
    });

    return ProfileMapper.toDomain(saved);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.profile.delete({
      where: { userId },
    });
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!record) return null;

    return ProfileMapper.toDomain(record);
  }
}
