import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { IsNumber, Min, IsOptional, Length, IsPositive } from 'class-validator';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';
import { SelectedVariants } from '@/shared/types';


@Entity('order_items')
@Index('idx_order', ['orderId'])
@Index('idx_product', ['productId'])
@Check(`quantity > 0`)
@Check(`total_price = quantity * unit_price`)
export class OrderItemEntity extends BaseEntity {
  @Column('uuid', { name: 'order_id' })
  orderId: string;

  @Column('uuid', { name: 'product_id' })
  productId: string;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  @Length(1, 255)
  productName: string;

  @Column({ name: 'product_sku', type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  productSku?: string;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Column({ name: 'selected_variants', type: 'json', nullable: true })
  @IsOptional()
  selectedVariants?: SelectedVariants;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  get hasVariants(): boolean {
    return !!this.selectedVariants && Object.keys(this.selectedVariants).length > 0;
  }


  get variantDisplay(): string | null {
    if (!this.selectedVariants) return null;

    return Object.entries(this.selectedVariants)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }


  get fullProductName(): string {
    if (this.variantDisplay) {
      return `${this.productName} (${this.variantDisplay})`;
    }
    return this.productName;
  }


  getDiscountAmount(currentPrice: number): number {
    if (currentPrice <= this.unitPrice) return 0;
    return (currentPrice - this.unitPrice) * this.quantity;
  }


  getDiscountPercentage(currentPrice: number): number {
    if (currentPrice <= this.unitPrice) return 0;
    return Math.round(((currentPrice - this.unitPrice) / currentPrice) * 100);
  }

  get isTotalValid(): boolean {
    const calculatedTotal = this.quantity * this.unitPrice;
    return Math.abs(this.totalPrice - calculatedTotal) < 0.01; // Allow for rounding
  }
}