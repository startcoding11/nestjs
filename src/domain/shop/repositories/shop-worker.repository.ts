import { ShopWorkerEntity } from '@/core/entities/mysql/shop-worker.entity';
import { ShopWorkerRole } from '@/shared/enums';


export interface ShopWorkerRepository {
  findById(id: string): Promise<ShopWorkerEntity | null>;
  findByShopId(shopId: string): Promise<ShopWorkerEntity[]>;
  findByUserId(userId: string): Promise<ShopWorkerEntity[]>;
  findOneByShopAndUser(shopId: string, userId: string): Promise<ShopWorkerEntity | null>;
  findWorkersByRole(shopId: string, role: ShopWorkerRole): Promise<ShopWorkerEntity[]>;
  create(data: Partial<ShopWorkerEntity>): Promise<ShopWorkerEntity>;
  update(id: string, data: Partial<ShopWorkerEntity>): Promise<ShopWorkerEntity | null>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  acceptInvitation(shopId: string, userId: string): Promise<void>;
  inviteWorker(shopId: string, userId: string, role: ShopWorkerRole): Promise<ShopWorkerEntity>;
  removeWorker(shopId: string, userId: string): Promise<boolean>;
  countActiveWorkers(shopId: string): Promise<number>;
  isWorkerInShop(shopId: string, userId: string): Promise<boolean>;
  getOwnerByShopId(shopId: string): Promise<ShopWorkerEntity | null>;
}