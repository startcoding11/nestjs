import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { IsNumber, Min, IsOptional, IsPositive } from 'class-validator';
import { BaseEntity } from './base.entity';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';
import { SelectedVariants } from '@/shared/types';


@Entity('cart_items')
@Index('idx_cart', ['cartId'])
@Index('idx_product', ['productId'])
@Check(`quantity > 0`)
export class CartItemEntity extends BaseEntity {
  @Column('uuid', { name: 'cart_id' })
  cartId: string;

  @Column('uuid', { name: 'product_id' })
  productId: string;

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

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;


  get lineTotal(): number {
    return this.quantity * this.unitPrice;
  }


  get hasVariants(): boolean {
    return !!this.selectedVariants && Object.keys(this.selectedVariants).length > 0;
  }


  get variantDisplay(): string | null {
    if (!this.selectedVariants) return null;

    return Object.entries(this.selectedVariants)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }


  get uniqueKey(): string {
    const variantsKey = this.selectedVariants
      ? JSON.stringify(this.selectedVariants)
      : 'no-variants';
    return `${this.productId}_${variantsKey}`;
  }
}