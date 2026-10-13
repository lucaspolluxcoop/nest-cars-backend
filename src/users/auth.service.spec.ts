import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException } from '@nestjs/common'

describe('Auth Service', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const newUser = { email, password, id: users.length++ } as User
        users.push(newUser)
        return Promise.resolve(newUser)
      }
    }
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile()

    service = module.get(AuthService)
  })
  it('can create an instance of service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with a usar and a password', async () => {
    const user = await service.signUp('asd@test.com', '12341234')

    expect(user.id).toBeDefined()
    expect(user.password).not.toEqual('12341234')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if a user signs up with an existing email', async () => {
    await service.signUp('a@test.com', '12341234')
    await expect(service.signUp('a@test.com', '12341234')).rejects.toThrow(
      BadRequestException
    )
  })

  it('throws an error if signin with an unused email', async () => {
    await expect(service.signIn('a@test.com', '123')).rejects.toThrow(
      BadRequestException
    )
  })

  it('throws an error if an invalid password is provided', async () => {
    await service.signUp('asd@test.com', 'password123')
    await expect(service.signIn('asd@test.com', 'password')).rejects.toThrow(
      BadRequestException
    )
  })

  it('returns a user if correct password is provided', async () => {
    await service.signUp('asd@test.com', 'password')
    const user = await service.signIn('asd@test.com', 'password')
    expect(user).toBeDefined()
  })
})
