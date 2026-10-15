import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asd@test.com',
          password: '1234'
        } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1234' } as User])
      }
      /* remove: () => {},
      update: () => {} */
    }
    fakeAuthService = {
      /* signUp: () => {}, */
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return a list of users with a given email', async () => {
    const users = await controller.findAllUser('asd@test.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('asd@test.com')
  })

  it('should returns a single user with the given id', async () => {
    const user = await controller.findUser('2')
    expect(user).toBeDefined()
  })

  it('should throw an error if user with the given id is not found', async () => {
    fakeUsersService.findOne = () => {
      throw new NotFoundException('User not found')
    }

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('should update session object and return user when signin', async () => {
    const session = { userId: -10 }
    const user = await controller.signin(
      { email: 'asd@test.com', password: '1234' },
      session
    )

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
})
