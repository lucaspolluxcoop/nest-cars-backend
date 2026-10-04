import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update.user.dto'
import { UsersService } from './users.service'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return await this.usersService.findOne(parseInt(id))
  }

  @Get()
  async findAllUser(@Query('email') email: string) {
    return await this.usersService.find(email)
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    return await this.authService.signup(body.email, body.password)
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signIn(body.email, body.password)
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(parseInt(id), body)
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id))
  }
}
