import {
  Entity,
  Column,
  Index,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsEnum, IsBoolean, IsOptional, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { UserRole } from '@/shared/enums';
import { CustomerProfileEntity } from './customer-profile.entity';
import { WorkerProfileEntity } from './worker-profile.entity';
import { ShopEntity } from './shop.entity';
import { ShopWorkerEntity } from './shop-worker.entity';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { AddressEntity } from './address.entity';


@Entity('users')
@Index('idx_email', ['email'])
@Index('idx_role', ['role'])
@Index('idx_supertokens_id', ['supertokensUserId'])
@Index('idx_created_at', ['createdAt'])
@Index('idx_active', ['isActive'])
export class UserEntity extends BaseEntity {
  @Column({
    name: 'supertokens_user_id',
    type: 'varchar',
    length: 128,
    unique: true,
  })
  @Index({ unique: true })
  supertokensUserId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  @Index({ unique: true })
  email: string;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  @IsBoolean()
  emailVerified: boolean;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  firstName?: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  lastName?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  phone?: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  avatarUrl?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;

  @OneToOne(() => CustomerProfileEntity, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerProfile?: CustomerProfileEntity;

  @OneToOne(() => WorkerProfileEntity, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  workerProfile?: WorkerProfileEntity;

  @OneToMany(() => ShopEntity, (shop) => shop.owner)
  ownedShops: ShopEntity[];

  @OneToMany(() => ShopWorkerEntity, (shopWorker) => shopWorker.user)
  shopWorkers: ShopWorkerEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.user)
  carts: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses: AddressEntity[];

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.lastName || this.email;
  }

  get isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }


  get isWorker(): boolean {
    return [UserRole.SELLER, UserRole.MANAGER, UserRole.OWNER].includes(this.role);
  }

  get isAdmin(): boolean {
    return this.role === UserRole.OWNER;
  }
}