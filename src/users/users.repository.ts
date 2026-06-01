import { Injectable } from '@nestjs/common'
import type { User } from '../../types/domain.js'
import { DatabaseService } from '../database/database.service.js'

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DatabaseService) {
  }

  async findById(id: string): Promise<User | undefined> {
    const [user] = await this.db.client.select('*').from('Users').where({ id })

    return user
  }

  async countById(id: string): Promise<number> {
    const result = await this.db.client.count().from('Users').where({ id }).first()

    return Number(result?.count ?? 0)
  }

  async insert(user: User): Promise<void> {
    await this.db.client.insert(user).into('Users')
  }

  async update(id: string, changes: Partial<User>): Promise<void> {
    await this.db.client('Users').update(changes).where({ id })
  }
}
