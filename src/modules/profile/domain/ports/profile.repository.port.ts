import { Profile } from '@modules/profile/domain/entities/profile.entity';

export interface IProfileRepository {
  save(profile: Profile): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
  deleteByUserId(userId: string): Promise<void>;
}
