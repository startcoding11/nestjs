import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { UserEntity } from '@/core/entities/mysql/user.entity';
import { UserRepository } from '@/domain/user/repositories/user.repository';
import { UserRole } from '@/shared/enums';

@Injectable()
export class UserRepositoryImpl extends BaseRepository<UserEntity> implements UserRepository {
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

  async findByRole(role: UserRole): Promise<UserEntity[]> {
    return this.repository.find({
      where: { role },
      order: { createdAt: 'DESC' },
    });
  }
}

