// src/core/database/repositories/shop-worker.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopWorkerEntity } from '@/core/entities/mysql/shop-worker.entity';
import { ShopWorkerRepository } from '@/domain/shop/repositories/shop-worker.repository';
import { ShopWorkerRole } from '@/shared/enums';
import { BaseRepository } from '@/core/repositories/mysql/base.repository';

@Injectable()
export class ShopWorkerRepositoryImpl extends BaseRepository<ShopWorkerEntity> implements ShopWorkerRepository {
  constructor(
    @InjectRepository(ShopWorkerEntity)
    private readonly shopWorkerRepository: Repository<ShopWorkerEntity>,
  ) {
    super(shopWorkerRepository);
  }

  async findByShopId(shopId: string): Promise<ShopWorkerEntity[]> {
    return this.repository.find({
      where: { shopId, isActive: true },
      relations: ['user', 'shop'],
    });
  }

  async findByUserId(userId: string): Promise<ShopWorkerEntity[]> {
    return this.repository.find({
      where: { userId, isActive: true },
      relations: ['shop'],
    });
  }

  async findOneByShopAndUser(shopId: string, userId: string): Promise<ShopWorkerEntity | null> {
    return this.repository.findOne({
      where: { shopId, userId },
      relations: ['user', 'shop'],
    });
  }

  async findWorkersByRole(shopId: string, role: ShopWorkerRole): Promise<ShopWorkerEntity[]> {
    return this.repository.find({
      where: { shopId, role, isActive: true },
      relations: ['user'],
    });
  }

  async acceptInvitation(shopId: string, userId: string): Promise<void> {
    await this.repository.update(
      { shopId, userId },
      {
        isActive: true,
        joinedAt: new Date()
      }
    );
  }

  async inviteWorker(shopId: string, userId: string, role: ShopWorkerRole): Promise<ShopWorkerEntity> {
    const shopWorker = this.repository.create({
      shopId,
      userId,
      role,
      isActive: false,
      invitedAt: new Date()
    });
    return this.repository.save(shopWorker);
  }

  async removeWorker(shopId: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ shopId, userId });
    return result.affected !== 0;
  }

  async countActiveWorkers(shopId: string): Promise<number> {
    return this.repository.count({
      where: { shopId, isActive: true }
    });
  }

  async isWorkerInShop(shopId: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { shopId, userId, isActive: true }
    });
    return count > 0;
  }

  async getOwnerByShopId(shopId: string): Promise<ShopWorkerEntity | null> {
    return this.repository.findOne({
      where: { shopId, role: ShopWorkerRole.OWNER, isActive: true },
      relations: ['user']
    });
  }
}