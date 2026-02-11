import { CustomerProfileEntity } from '@/core/entities/mysql/customer-profile.entity';

export interface CustomerProfileRepository {
  findById(id: string): Promise<CustomerProfileEntity | null>;
  findByUserId(userId: string): Promise<CustomerProfileEntity | null>;
  findByUserIds(userIds: string[]): Promise<CustomerProfileEntity[]>;
  create(data: Partial<CustomerProfileEntity>): Promise<CustomerProfileEntity>;
  update(id: string, data: Partial<CustomerProfileEntity>): Promise<CustomerProfileEntity | null>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  incrementLoyaltyPoints(userId: string, points: number): Promise<void>;
  incrementTotalSpent(userId: string, amount: number): Promise<void>;
  updateDefaultAddresses(
    userId: string,
    shippingAddressId?: string,
    billingAddressId?: string,
  ): Promise<void>;
}