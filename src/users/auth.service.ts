import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt} from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    if ((await this.usersService.find(email)).length) {
      throw new BadRequestException('Email already in use')
    }

    //Generate a salt
    const salt = randomBytes(8).toString('hex')

    //Hash the password and the salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer

    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex')

    const user = await this.usersService.create(email, result)

    return user
  }

  signIn() {}
}
