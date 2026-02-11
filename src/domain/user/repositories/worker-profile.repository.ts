import { WorkerProfileEntity } from '@/core/entities/mysql/worker-profile.entity';

export interface WorkerProfileRepository {
  findById(id: string): Promise<WorkerProfileEntity | null>;
  findByUserId(userId: string): Promise<WorkerProfileEntity | null>;
  findByEmployeeId(employeeId: string): Promise<WorkerProfileEntity | null>;
  findByDepartment(department: string): Promise<WorkerProfileEntity[]>;
  create(data: Partial<WorkerProfileEntity>): Promise<WorkerProfileEntity>;
  update(id: string, data: Partial<WorkerProfileEntity>): Promise<WorkerProfileEntity | null>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  updatePermissions(userId: string, permissions: Record<string, any>): Promise<void>;
  assignEmployeeId(userId: string, employeeId: string): Promise<void>;
  setHireDate(userId: string, hireDate: Date): Promise<void>;
}