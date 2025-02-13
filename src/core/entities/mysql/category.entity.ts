import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsBoolean, IsOptional, IsNumber, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';

@Entity('categories')
@Index('idx_parent', ['parentId'])
@Index('idx_slug', ['slug'])
@Index('idx_active', ['isActive'])
@Index('idx_display_order', ['displayOrder'])
export class CategoryEntity extends BaseEntity {
  @Column('uuid', { name: 'parent_id', nullable: true })
  @IsOptional()
  parentId?: string;

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

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  imageUrl?: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  @IsNumber()
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'meta_title', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @Length(1, 255)
  metaTitle?: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  @IsOptional()
  metaDescription?: string;


  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryEntity;


  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];


  @ManyToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];


  get isRoot(): boolean {
    return !this.parentId;
  }

  get isLeaf(): boolean {
    return !this.children || this.children.length === 0;
  }


  async getDepth(): Promise<number> {
    let depth = 0;
    let current: CategoryEntity | undefined = this;

    while (current?.parent) {
      depth++;
      current = current.parent;
    }

    return depth;
  }

  async getPath(separator: string = ' > '): Promise<string> {
    const path: string[] = [this.name];
    let current: CategoryEntity | undefined = this;

    while (current?.parent) {
      path.unshift(current.parent.name);
      current = current.parent;
    }

    return path.join(separator);
  }
}