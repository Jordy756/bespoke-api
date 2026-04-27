import { RegisterUserCommand } from '@modules/users/application/commands/register-user.command';
import { CreateUserDto } from '@modules/users/application/dtos/create-user.dto';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { UserMapper } from '@modules/users/application/mappers/user.mapper';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(@Inject(RegisterUserCommand) private readonly registerUserCommand: RegisterUserCommand) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const result = await this.registerUserCommand.execute(UserMapper.toCreateEntity(createUserDto));
      return UserMapper.toDTO(result);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
