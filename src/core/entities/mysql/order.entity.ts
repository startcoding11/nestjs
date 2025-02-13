import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { IsEnum, IsOptional, IsNumber, Min, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatus, PaymentStatus } from '@/shared/enums';

@Entity('orders')
@Index('idx_user', ['userId'])
@Index('idx_order_number', ['orderNumber'])
@Index('idx_status', ['status'])
@Index('idx_payment_status', ['paymentStatus'])
@Index('idx_created_at', ['createdAt'])
@Index('idx_confirmed_at', ['confirmedAt'])
@Index('idx_tracking', ['trackingNumber'])
@Index('idx_order_user_created', ['userId', 'createdAt'])
export class OrderEntity extends BaseEntity {
  @Column({ name: 'order_number', type: 'varchar', length: 50, unique: true })
  @Length(1, 50)
  @Index({ unique: true })
  orderNumber: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'shipping_address_id' })
  shippingAddressId: string;

  @Column('uuid', { name: 'billing_address_id' })
  billingAddressId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @Length(1, 50)
  paymentMethod?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  tax: number;

  @Column({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  total: number;

  @Column({ name: 'customer_note', type: 'text', nullable: true })
  @IsOptional()
  customerNote?: string;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  @IsOptional()
  adminNote?: string;

  @Column({ name: 'tracking_number', type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  trackingNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  carrier?: string;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  @IsOptional()
  confirmedAt?: Date;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  @IsOptional()
  shippedAt?: Date;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  @IsOptional()
  deliveredAt?: Date;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  @IsOptional()
  cancelledAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => AddressEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: AddressEntity;


  @ManyToOne(() => AddressEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'billing_address_id' })
  billingAddress: AddressEntity;


  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItemEntity[];

  @BeforeInsert()
  generateOrderNumber() {
    if (!this.orderNumber) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, '0');
      this.orderNumber = `ORD-${year}-${random}`;
    }
  }

  get isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  get isConfirmed(): boolean {
    return this.status === OrderStatus.CONFIRMED;
  }


  get isShipped(): boolean {
    return this.status === OrderStatus.SHIPPED;
  }


  get isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }


  get isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }


  get isRefunded(): boolean {
    return this.status === OrderStatus.REFUNDED;
  }


  get isPaid(): boolean {
    return this.paymentStatus === PaymentStatus.PAID;
  }


  get canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.CONFIRMED].includes(
      this.status
    );
  }


  get canBeRefunded(): boolean {
    return (
      this.isPaid &&
      [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(
        this.status
      )
    );
  }

  get totalItems(): number {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get processingTime(): number | null {
    if (!this.confirmedAt) return null;
    return Math.floor(
      (this.confirmedAt.getTime() - this.createdAt.getTime()) / 1000 / 60
    ); // in minutes
  }

  get deliveryTime(): number | null {
    if (!this.shippedAt || !this.deliveredAt) return null;
    return Math.floor(
      (this.deliveredAt.getTime() - this.shippedAt.getTime()) / 1000 / 60 / 60 / 24
    ); // in days
  }

  get statusColor(): string {
    switch (this.status) {
      case OrderStatus.PENDING:
        return 'yellow';
      case OrderStatus.PROCESSING:
        return 'blue';
      case OrderStatus.CONFIRMED:
        return 'purple';
      case OrderStatus.SHIPPED:
        return 'indigo';
      case OrderStatus.DELIVERED:
        return 'green';
      case OrderStatus.CANCELLED:
        return 'gray';
      case OrderStatus.REFUNDED:
        return 'red';
      default:
        return 'gray';
    }
  }
}