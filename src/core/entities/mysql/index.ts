import { UserEntity } from '@/core/entities/mysql/user.entity';
import { CustomerProfileEntity } from '@/core/entities/mysql/customer-profile.entity';
import { WorkerProfileEntity } from '@/core/entities/mysql/worker-profile.entity';
import { ShopEntity } from '@/core/entities/mysql/shop.entity';
import { ShopWorkerEntity } from '@/core/entities/mysql/shop-worker.entity';
import { CategoryEntity } from '@/core/entities/mysql/category.entity';
import { ProductEntity } from '@/core/entities/mysql/product.entity';
import { ProductImageEntity } from '@/core/entities/mysql/product-image.entity';
import { CartEntity } from '@/core/entities/mysql/cart.entity';
import { CartItemEntity } from '@/core/entities/mysql/cart-item.entity';
import { AddressEntity } from '@/core/entities/mysql/address.entity';
import { OrderEntity } from '@/core/entities/mysql/order.entity';
import { OrderItemEntity } from '@/core/entities/mysql/order-item.entity';


export const entities = [
  UserEntity,
  CustomerProfileEntity,
  WorkerProfileEntity,
  ShopEntity,
  ShopWorkerEntity,
  CategoryEntity,
  ProductEntity,
  ProductImageEntity,
  CartEntity,
  CartItemEntity,
  AddressEntity,
  OrderEntity,
  OrderItemEntity,
];

export const Entity = {
  UserEntity,
  CustomerProfileEntity,
  WorkerProfileEntity,
  ShopEntity,
  ShopWorkerEntity,
  CategoryEntity,
  ProductEntity,
  ProductImageEntity,
  CartEntity,
  CartItemEntity,
  AddressEntity,
  OrderEntity,
  OrderItemEntity,
};