import { CreateUserDto } from '@modules/account/application/dtos/create-user.dto';
import { LoginUserDto } from '@modules/account/application/dtos/login-user.dto';
import { UserResponseDto } from '@modules/account/application/dtos/user-response.dto';
import { User } from '@modules/account/domain/entities/user.entity';
import { AuthProvider } from '@modules/account/domain/enums/auth-provider.enum';
import { SubscriptionPlan } from '@modules/account/domain/enums/subscription-plan.enum';
import { UserEmail } from '@modules/account/domain/value-objects/user-email';

export class UserMapper {
  static toCreateEntity(dto: CreateUserDto): User {
    return User.createNew(dto.email, dto.provider, dto.providerId, dto.name, dto.avatarUrl);
  }

  static toLoginEntity(dto: LoginUserDto): UserEmail {
    return UserEmail.create(dto.email);
  }

  static toDomain(data: {
    id: string;
    email: string;
    provider: unknown;
    providerId: string;
    name: string | null;
    avatarUrl: string | null;
    plan: unknown;
    dailyCredits: number;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.reconstruct({
      id: data.id,
      email: UserEmail.create(data.email),
      provider: data.provider as AuthProvider,
      providerId: data.providerId,
      name: data.name,
      avatarUrl: data.avatarUrl,
      plan: data.plan as SubscriptionPlan,
      dailyCredits: data.dailyCredits,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toDTO(user: User): UserResponseDto {
    return {
      id: user.id!,
      email: user.email.getValue(),
      provider: user.provider,
      name: user.name ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      plan: user.plan,
      dailyCredits: user.dailyCredits,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }

  static toDTOs(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toDTO(user));
  }
}
