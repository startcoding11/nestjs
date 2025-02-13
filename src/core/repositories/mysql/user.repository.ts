import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { UserEntity } from '@/core/entities/mysql/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['customerProfile', 'workerProfile'],
    });
  }

  async findBySupertokensId(supertokensUserId: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { supertokensUserId },
    });
  }

  async findActiveUsers(): Promise<UserEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getCustomerStats(): Promise<{ total: number; verified: number }> {
    const [total, verified] = await Promise.all([
      this.repository.count(),
      this.repository.count({ where: { emailVerified: true } }),
    ]);
    return { total, verified };
  }
}