import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { IsOptional, IsNumber, Min, IsDateString } from 'class-validator';
import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { BaseEntity } from '@/core/entities/mysql/base.entity';

@Entity('customer_profiles')
@Index('idx_total_spent', ['totalSpent'])
@Index('idx_loyalty_points', ['loyaltyPoints'])
export class CustomerProfileEntity extends BaseEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  preferences?: Record<string, any>;

  @Column({
    name: 'default_shipping_address_id',
    type: 'uuid',
    nullable: true,
  })
  @IsOptional()
  defaultShippingAddressId?: string;

  @Column({
    name: 'default_billing_address_id',
    type: 'uuid',
    nullable: true,
  })
  @IsOptional()
  defaultBillingAddressId?: string;

  @Column({ name: 'loyalty_points', type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  loyaltyPoints: number;

  @Column({
    name: 'total_spent',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  totalSpent: number;

  @OneToOne(() => UserEntity, (user) => user.customerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;


  @ManyToOne(() => AddressEntity, { nullable: true })
  @JoinColumn({ name: 'default_shipping_address_id' })
  defaultShippingAddress?: AddressEntity;

  @ManyToOne(() => AddressEntity, { nullable: true })
  @JoinColumn({ name: 'default_billing_address_id' })
  defaultBillingAddress?: AddressEntity;

  get age(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  get isVip(): boolean {
    return this.totalSpent >= 1000; // $1000+ spent
  }
}