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
import { CustomerProfile } from './customer-profile.entity';
import { WorkerProfile } from './worker-profile.entity';
import { Shop } from './shop.entity';
import { ShopWorker } from './shop-worker.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Address } from './address.entity';


@Entity('users')
@Index('idx_email', ['email'])
@Index('idx_role', ['role'])
@Index('idx_supertokens_id', ['supertokensUserId'])
@Index('idx_created_at', ['createdAt'])
@Index('idx_active', ['isActive'])
export class User extends BaseEntity {
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

  @OneToOne(() => CustomerProfile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerProfile?: CustomerProfile;

  @OneToOne(() => WorkerProfile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  workerProfile?: WorkerProfile;

  @OneToMany(() => Shop, (shop) => shop.owner)
  ownedShops: Shop[];

  @OneToMany(() => ShopWorker, (shopWorker) => shopWorker.user)
  shopWorkers: ShopWorker[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

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