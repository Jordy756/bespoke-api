import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { RegisterUserCommand } from '@modules/users/application/commands/register-user.command';
import { UserAlreadyExistsException } from '@modules/users/domain/exceptions/user-already-exists.exception';

@Controller('auth')
export class UsersController {
  constructor(@Inject(RegisterUserCommand) private readonly registerUserCommand: RegisterUserCommand) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const command = { email: createUserDto.email };
      const result = await this.registerUserCommand.execute(command);
      return result;
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      if (error instanceof Error && error.message.includes('Invalid')) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
