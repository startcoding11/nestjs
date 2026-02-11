// src/core/database/repositories/worker-profile.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerProfileEntity } from '@/core/entities/mysql/worker-profile.entity';
import { WorkerProfileRepository } from '@/domain/user/repositories/worker-profile.repository';
import { BaseRepository } from '@/core/repositories/mysql/base.repository';

@Injectable()
export class WorkerProfileRepositoryImpl
  extends BaseRepository<WorkerProfileEntity>
  implements WorkerProfileRepository
{
  constructor(
    @InjectRepository(WorkerProfileEntity)
    private readonly workerProfileRepository: Repository<WorkerProfileEntity>,
  ) {
    super(workerProfileRepository);
  }

  async findByUserId(userId: string): Promise<WorkerProfileEntity | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findByEmployeeId(employeeId: string): Promise<WorkerProfileEntity | null> {
    return this.repository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
  }

  async findByDepartment(department: string): Promise<WorkerProfileEntity[]> {
    return this.repository.find({
      where: { department },
      relations: ['user'],
      order: { hireDate: 'DESC' },
    });
  }

  async updatePermissions(userId: string, permissions: Record<string, any>): Promise<void> {
    await this.repository.update(
      { userId },
      { permissions }
    );
  }

  async assignEmployeeId(userId: string, employeeId: string): Promise<void> {
    await this.repository.update(
      { userId },
      { employeeId }
    );
  }

  async setHireDate(userId: string, hireDate: Date): Promise<void> {
    await this.repository.update(
      { userId },
      { hireDate }
    );
  }
}