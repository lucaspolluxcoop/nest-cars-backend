import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  Session,
  UseGuards
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update.user.dto'
import { UsersService } from './users.service'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'
import { currentUser } from './decorators/current-user.decorators'
import { User } from './user.entity'
import { AuthGuard } from '../guards/auth.guards'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  me(@currentUser() user: User) {
    return user
  }

  @Post('/signout')
  signOut(@Session() session:any) {
    session.userId = null
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password)
    session.userId = user.id
    return user
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return await this.usersService.findOne(parseInt(id))
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllUser(@Query('email') email: string) {
    return await this.usersService.find(email)
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(parseInt(id), body)
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id))
  }
}
