import { UserEntity } from '@/core/entities/mysql/user.entity';
import { UserRole } from '@/shared/enums';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntity | null>;

  findBySupertokensId(supertokensUserId: string): Promise<UserEntity | null>;

  findActiveUsers(): Promise<UserEntity[]>;

  findByRole(role: UserRole): Promise<UserEntity[]>;

  create(data: Partial<UserEntity>): Promise<UserEntity>;

  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;

  delete(id: string): Promise<boolean>;

  softDelete(id: string): Promise<boolean>;

  exists(id: string): Promise<boolean>;

  count(where?: any): Promise<number>;

  getCustomerStats(): Promise<{ total: number; verified: number }>;
}
