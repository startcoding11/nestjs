import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsBoolean, IsOptional, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('addresses')
@Index('idx_user', ['userId'])
@Index('idx_default_shipping', ['isDefaultShipping'])
@Index('idx_default_billing', ['isDefaultBilling'])
export class AddressEntity extends BaseEntity {
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @Length(1, 50)
  label?: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  @Length(1, 255)
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  @Length(1, 20)
  phone: string;

  @Column({ name: 'address_line1', type: 'varchar', length: 255 })
  @Length(1, 255)
  addressLine1: string;

  @Column({ name: 'address_line2', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @Length(1, 255)
  addressLine2?: string;

  @Column({ type: 'varchar', length: 100 })
  @Length(1, 100)
  city: string;

  @Column({ type: 'varchar', length: 100 })
  @Length(1, 100)
  state: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20 })
  @Length(1, 20)
  postalCode: string;

  @Column({ type: 'varchar', length: 100 })
  @Length(1, 100)
  country: string;

  @Column({ name: 'is_default_shipping', type: 'boolean', default: false })
  @IsBoolean()
  isDefaultShipping: boolean;

  @Column({ name: 'is_default_billing', type: 'boolean', default: false })
  @IsBoolean()
  isDefaultBilling: boolean;


  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

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

  get formattedAddress(): string {
    const lines = [
      this.fullName,
      this.addressLine1,
      this.addressLine2,
      `${this.city}, ${this.state} ${this.postalCode}`,
      this.country,
      this.phone,
    ].filter(Boolean);

    return lines.join('\n');
  }

  get shortDisplay(): string {
    return this.label || `${this.city}, ${this.state}`;
  }

  get isDefault(): boolean {
    return this.isDefaultShipping || this.isDefaultBilling;
  }
}