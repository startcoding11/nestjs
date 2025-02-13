import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsEmail, IsBoolean, IsOptional, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ShopWorker } from './shop-worker.entity';
import { Product } from './product.entity';


@Entity('shops')
@Index('idx_owner', ['ownerId'])
@Index('idx_slug', ['slug'])
@Index('idx_active', ['isActive'])
@Index('idx_created_at', ['createdAt'])
export class Shop extends BaseEntity {
  @Column('uuid', { name: 'owner_id' })
  ownerId: string;

  @Column({ type: 'varchar', length: 255 })
  @Length(1, 255)
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Length(1, 255)
  @Index({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description?: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  logoUrl?: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  contactPhone?: string;

  @Column({ name: 'address_line1', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  addressLine1?: string;

  @Column({ name: 'address_line2', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  addressLine2?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  state?: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  postalCode?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  country?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  @IsBoolean()
  isVerified: boolean;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  settings?: Record<string, any>;


  @ManyToOne(() => User, (user) => user.ownedShops, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => ShopWorker, (shopWorker) => shopWorker.shop)
  workers: ShopWorker[];

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  get fullAddress(): string {
    const parts = [
      this.addressLine1,
      this.addressLine2,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ].filter(Boolean);

    return parts.join(', ');
  }

  get hasCompleteAddress(): boolean {
    return !!(
      this.addressLine1 &&
      this.city &&
      this.state &&
      this.postalCode &&
      this.country
    );
  }
}