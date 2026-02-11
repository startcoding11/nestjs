import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { ShopEntity } from '@/core/entities/mysql/shop.entity';
import { ShopRepository } from '@/domain/shop/repositories/shop.repository';

@Injectable()
export class ShopRepositoryImpl extends BaseRepository<ShopEntity> implements ShopRepository {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>,
  ) {
    super(shopRepository);
  }

  async findByOwnerId(ownerId: string): Promise<ShopEntity[]> {
    return this.repository.find({
      where: { ownerId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<ShopEntity | null> {
    return this.repository.findOne({
      where: { slug },
      relations: ['owner', 'workers', 'workers.user'],
    });
  }

  async findActiveShops(): Promise<ShopEntity[]> {
    return this.repository.find({
      where: { isActive: true, isVerified: true },
      order: { createdAt: 'DESC' },
    });
  }

  async verifyShop(shopId: string): Promise<void> {
    await this.repository.update(shopId, { isVerified: true });
  }

  async toggleActive(shopId: string, isActive: boolean): Promise<void> {
    await this.repository.update(shopId, { isActive });
  }

  async searchShops(query: string): Promise<ShopEntity[]> {
    return this.repository
      .createQueryBuilder('shop')
      .where('shop.name LIKE :query OR shop.description LIKE :query', {
        query: `%${query}%`
      })
      .andWhere('shop.isActive = :isActive', { isActive: true })
      .andWhere('shop.isVerified = :isVerified', { isVerified: true })
      .orderBy('shop.createdAt', 'DESC')
      .getMany();
  }
}