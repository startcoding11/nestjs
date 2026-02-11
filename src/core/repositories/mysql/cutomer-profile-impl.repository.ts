import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { CustomerProfileEntity } from '@/core/entities/mysql/customer-profile.entity';
import { CustomerProfileRepository } from '@/domain/user/repositories/customer-profile.repository';

@Injectable()
export class CustomerProfileRepositoryImpl extends BaseRepository<CustomerProfileEntity> implements CustomerProfileRepository{
  constructor(
    @InjectRepository(CustomerProfileEntity)
    private readonly customerProfileRepository: Repository<CustomerProfileEntity>,
  ) {
    super(customerProfileRepository);
  }

  async findByUserId(userId: string): Promise<CustomerProfileEntity | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user', 'defaultShippingAddress', 'defaultBillingAddress'],
    });
  }

  async findByUserIds(userIds: string[]): Promise<CustomerProfileEntity[]> {
    return this.repository.find({
      where: userIds.map(id => ({ userId: id })),
      relations: ['user'],
    });
  }

  async incrementLoyaltyPoints(userId: string, points: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({
        loyaltyPoints: () => `loyalty_points + ${points}`
      })
      .where('user_id = :userId', { userId })
      .execute();
  }

  async incrementTotalSpent(userId: string, amount: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({
        totalSpent: () => `total_spent + ${amount}`
      })
      .where('user_id = :userId', { userId })
      .execute();
  }

  async updateDefaultAddresses(
    userId: string,
    shippingAddressId?: string,
    billingAddressId?: string,
  ): Promise<void> {
    const updateData: any = {};
    if (shippingAddressId) updateData.defaultShippingAddressId = shippingAddressId;
    if (billingAddressId) updateData.defaultBillingAddressId = billingAddressId;

    await this.repository.update({ userId }, updateData);
  }
}