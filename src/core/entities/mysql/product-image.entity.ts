import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsBoolean, IsOptional, IsNumber, Min, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';


@Entity('product_images')
@Index('idx_product', ['productId'])
@Index('idx_display_order', ['displayOrder'])
@Index('idx_primary', ['isPrimary'])
export class ProductImage extends BaseEntity {
  @Column('uuid', { name: 'product_id' })
  productId: string;

  @Column({ type: 'varchar', length: 500 })
  @Length(1, 500)
  url: string;

  @Column({ name: 'alt_text', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @Length(1, 255)
  altText?: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  displayOrder: number;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  @IsBoolean()
  isPrimary: boolean;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  get filename(): string | null {
    if (!this.url) return null;
    const parts = this.url.split('/');
    return parts[parts.length - 1];
  }


  get isExternal(): boolean {
    return this.url.startsWith('http://') || this.url.startsWith('https://');
  }
}