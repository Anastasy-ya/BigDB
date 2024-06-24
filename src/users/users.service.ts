import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async resetProblemsFlag(): Promise<number> {
    const result = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ problems: false })
      .where('problems = true')
      .returning('id')
      .execute();

    return result.raw.length;
  }
}
