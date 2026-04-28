import { RegisterUserCommand } from '@modules/account/application/commands/register-user.command';
import { CreateUserDto } from '@modules/account/application/dtos/create-user.dto';
import { UserResponseDto } from '@modules/account/application/dtos/user-response.dto';
import { UserMapper } from '@modules/account/application/mappers/user.mapper';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';

@Controller('accounts')
export class AccountController {
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

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const result = await this.registerUserCommand.execute(UserMapper.toCreateEntity(createUserDto));
      return UserMapper.toDTO(result);
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }
}
