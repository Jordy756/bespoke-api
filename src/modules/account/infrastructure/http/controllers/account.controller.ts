import { LoginUserCommand } from '@modules/account/application/commands/login-user.command';
import { RegisterUserCommand } from '@modules/account/application/commands/register-user.command';
import { CreateUserDto } from '@modules/account/application/dtos/create-user.dto';
import { LoginUserDto } from '@modules/account/application/dtos/login-user.dto';
import { UserResponseDto } from '@modules/account/application/dtos/user-response.dto';
import { UserMapper } from '@modules/account/application/mappers/user.mapper';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';

@Controller('accounts')
export class AccountController {
  constructor(
    @Inject(RegisterUserCommand) private readonly registerUserCommand: RegisterUserCommand,
    @Inject(LoginUserCommand) private readonly loginUserCommand: LoginUserCommand,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const result = await this.registerUserCommand.execute(UserMapper.toCreateEntity(createUserDto));
    return UserMapper.toDTO(result);
  }

  @Post('sessions')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserResponseDto | null> {
    const result = await this.loginUserCommand.execute(UserMapper.toLoginEntity(loginUserDto));
    return result ? UserMapper.toDTO(result) : null;
  }
}
