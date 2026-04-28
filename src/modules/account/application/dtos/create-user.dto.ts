import { AuthProvider } from '@modules/account/domain/enums/auth-provider.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
  email!: string;

  @ApiProperty({
    description: 'The authentication provider used to sign in',
    enum: AuthProvider,
    example: AuthProvider.GOOGLE,
  })
  @IsEnum(AuthProvider, { message: 'Provider must be a valid AuthProvider' })
  provider!: AuthProvider;

  @ApiProperty({
    description: 'The unique ID provided by the authentication provider',
    example: 'google-oauth2|1234567890',
  })
  @IsString()
  providerId!: string;

  @ApiPropertyOptional({
    description: 'The display name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The URL of the user avatar',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
