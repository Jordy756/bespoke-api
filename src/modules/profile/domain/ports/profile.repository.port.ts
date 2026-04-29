import { Profile } from '@modules/profile/domain/entities/profile.entity';

export interface IProfileRepository {
  save(profile: Profile): Promise<Profile>;
  deleteByUserId(userId: string): Promise<void>;
  findByUserId(userId: string): Promise<Profile | null>;
}
