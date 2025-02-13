import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
import { CartStatus } from '@/shared/enums';


@Entity('carts')
@Index('idx_user', ['userId'])
@Index('idx_session', ['sessionId'])
@Index('idx_status', ['status'])
@Index('idx_expires', ['expiresAt'])
@Check(`user_id IS NOT NULL OR session_id IS NOT NULL`)
export class Cart extends BaseEntity {
  @Column('uuid', { name: 'user_id', nullable: true })
  @IsOptional()
  userId?: string;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  sessionId?: string;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  @IsEnum(CartStatus)
  status: CartStatus;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;


  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItem[];

  get isUserCart(): boolean {
    return !!this.userId;
  }

  get isGuestCart(): boolean {
    return !this.userId && !!this.sessionId;
  }

  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }


  get isActive(): boolean {
    return this.status === CartStatus.ACTIVE && !this.isExpired;
  }


  get totalItems(): number {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get subtotal(): number {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    );
  }

  get isEmpty(): boolean {
    return !this.items || this.items.length === 0;
  }
}