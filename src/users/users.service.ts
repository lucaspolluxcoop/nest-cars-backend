import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password })

    await this.repo.save(user)
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id })

    if (!user) throw new NotFoundException('User not found')

    return user
  }

  async find(email: string) {
    return await this.repo.findBy({ email })
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id)

    Object.assign(user, attrs)

    return await this.repo.save(user)
  }

  async remove(id: number) {
    const user = await this.findOne(id)

    return await this.repo.remove(user)
  }
}
