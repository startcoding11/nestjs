import { ShopEntity } from '@/core/entities/mysql/shop.entity';

export interface ShopRepository {
  findById(id: string): Promise<ShopEntity | null>;
  findByOwnerId(ownerId: string): Promise<ShopEntity[]>;
  findBySlug(slug: string): Promise<ShopEntity | null>;
  findActiveShops(): Promise<ShopEntity[]>;
  create(data: Partial<ShopEntity>): Promise<ShopEntity>;
  update(id: string, data: Partial<ShopEntity>): Promise<ShopEntity | null>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  verifyShop(shopId: string): Promise<void>;
  toggleActive(shopId: string, isActive: boolean): Promise<void>;
  searchShops(query: string): Promise<ShopEntity[]>;
}