// // import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';
// import { IsEmail } from 'class-validator';

// export class CreateUserDto {
//   @IsEmail({}, { message: 'Email must be a valid email address' })
//   email!: string;

//   // @IsString({ message: 'Password must be a string' })
//   // @MinLength(8, { message: 'Password must be at least 8 characters' })
//   // @Matches(/(?=.*[a-z])/, {
//   //   message: 'Password must contain at least one lowercase letter',
//   // })
//   // @Matches(/(?=.*[A-Z])/, {
//   //   message: 'Password must contain at least one uppercase letter',
//   // })
//   // @Matches(/(?=.*\d)/, {
//   //   message: 'Password must contain at least one number',
//   // })
//   // password!: string;
//   // @IsString({ message: 'Name must be a string' })
//   // @IsOptional()
//   // name?: string;
// }

import type { TransformFnParams } from 'class-transformer';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
  email!: string;
}
