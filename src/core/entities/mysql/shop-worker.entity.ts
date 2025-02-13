import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { BaseEntity } from './base.entity';
import { ShopEntity } from './shop.entity';
import { UserEntity } from './user.entity';
import { ShopWorkerRole } from '@/shared/enums';

@Entity('shop_workers')
@Unique('unique_shop_user', ['shopId', 'userId'])
@Index('idx_user_shops', ['userId'])
@Index('idx_shop_workers', ['shopId'])
@Index('idx_role', ['role'])
export class ShopWorkerEntity extends BaseEntity {
  @Column('uuid', { name: 'shop_id' })
  shopId: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ShopWorkerRole,
  })
  @IsEnum(ShopWorkerRole)
  role: ShopWorkerRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'invited_at', type: 'timestamp', nullable: true })
  @IsOptional()
  invitedAt?: Date;

  @Column({ name: 'joined_at', type: 'timestamp', nullable: true })
  @IsOptional()
  joinedAt?: Date;


  @ManyToOne(() => ShopEntity, (shop) => shop.workers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: ShopEntity;


  @ManyToOne(() => UserEntity, (user) => user.shopWorkers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;


  get isOwner(): boolean {
    return this.role === ShopWorkerRole.OWNER;
  }

  get isManager(): boolean {
    return this.role === ShopWorkerRole.MANAGER;
  }

  get canManageWorkers(): boolean {
    return this.role === ShopWorkerRole.OWNER || this.role === ShopWorkerRole.MANAGER;
  }

  get isPending(): boolean {
    return !!this.invitedAt && !this.joinedAt;
  }
}