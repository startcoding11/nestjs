import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import {
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  Length,
  IsPositive,
} from 'class-validator';
import { BaseEntity } from './base.entity';
import { Shop } from './shop.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { ProductDimensions, ProductVariants } from '@/shared/types';



@Entity('products')
@Index('idx_shop', ['shopId'])
@Index('idx_slug', ['slug'])
@Index('idx_sku', ['sku'])
@Index('idx_active', ['isActive'])
@Index('idx_featured', ['isFeatured'])
@Index('idx_price', ['price'])
@Index('idx_created_at', ['createdAt'])
@Index('idx_stock', ['stockQuantity'])
@Index('idx_product_shop_active_stock', ['shopId', 'isActive', 'stockQuantity'])
@Index('idx_product_search', ['shopId', 'isActive', 'createdAt'])
export class Product extends BaseEntity {
  @Column('uuid', { name: 'shop_id' })
  shopId: string;

  @Column({ type: 'varchar', length: 255 })
  @Length(1, 255)
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @Length(1, 255)
  slug: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description?: string;

  @Column({ name: 'short_description', type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @Length(1, 500)
  shortDescription?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsPositive()
  price: number;

  @Column({
    name: 'compare_at_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  compareAtPrice?: number;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  costPrice?: number;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  variants?: ProductVariants;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  @IsOptional()
  @Length(1, 100)
  @Index({ unique: true })
  sku?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  barcode?: string;

  @Column({ name: 'track_inventory', type: 'boolean', default: true })
  @IsBoolean()
  trackInventory: boolean;

  @Column({ name: 'allow_backorder', type: 'boolean', default: false })
  @IsBoolean()
  allowBackorder: boolean;

  @Column({ name: 'low_stock_threshold', type: 'int', default: 10 })
  @IsNumber()
  @Min(0)
  lowStockThreshold: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number; // in kg

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  dimensions?: ProductDimensions;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  @IsBoolean()
  isFeatured: boolean;

  @Column({ name: 'meta_title', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @Length(1, 255)
  metaTitle?: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  @IsOptional()
  metaDescription?: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  viewCount: number;

  @Column({ name: 'order_count', type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  orderCount: number;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageRating?: number;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  @IsOptional()
  publishedAt?: Date;


  @ManyToOne(() => Shop, (shop) => shop.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;


  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true,
  })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];


  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];


  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];


  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];


  get inStock(): boolean {
    if (!this.trackInventory) return true;
    return this.stockQuantity > 0 || this.allowBackorder;
  }

  get isLowStock(): boolean {
    if (!this.trackInventory) return false;
    return this.stockQuantity > 0 && this.stockQuantity <= this.lowStockThreshold;
  }


  get isOutOfStock(): boolean {
    if (!this.trackInventory) return false;
    return this.stockQuantity <= 0 && !this.allowBackorder;
  }


  get discountPercentage(): number | null {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
      return null;
    }
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }

  get isOnSale(): boolean {
    return !!this.compareAtPrice && this.compareAtPrice > this.price;
  }


  get profitMargin(): number | null {
    if (!this.costPrice) return null;
    return this.price - this.costPrice;
  }


  get profitMarginPercentage(): number | null {
    if (!this.costPrice || this.costPrice === 0) return null;
    return Math.round(((this.price - this.costPrice) / this.costPrice) * 100);
  }


  get hasVariants(): boolean {
    return !!this.variants && Object.keys(this.variants).length > 0;
  }


  get variantOptions(): string[] {
    if (!this.variants) return [];
    return Object.keys(this.variants);
  }


  get variantCombinations(): number {
    if (!this.variants) return 1;

    return Object.values(this.variants).reduce(
      (total, options) => total * options.length,
      1,
    );
  }

  get isPublished(): boolean {
    return !!this.publishedAt && this.publishedAt <= new Date();
  }
}