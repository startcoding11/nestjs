import { User } from '@/core/entities/mysql/user.entity';
import { CustomerProfile } from '@/core/entities/mysql/customer-profile.entity';
import { WorkerProfile } from '@/core/entities/mysql/worker-profile.entity';
import { Shop } from '@/core/entities/mysql/shop.entity';
import { ShopWorker } from '@/core/entities/mysql/shop-worker.entity';
import { Category } from '@/core/entities/mysql/category.entity';
import { Product } from '@/core/entities/mysql/product.entity';
import { ProductImage } from '@/core/entities/mysql/product-image.entity';
import { Cart } from '@/core/entities/mysql/cart.entity';
import { CartItem } from '@/core/entities/mysql/cart-item.entity';
import { Address } from '@/core/entities/mysql/address.entity';
import { Order } from '@/core/entities/mysql/order.entity';
import { OrderItem } from '@/core/entities/mysql/order-item.entity';


export const entities = [
  User,
  CustomerProfile,
  WorkerProfile,
  Shop,
  ShopWorker,
  Category,
  Product,
  ProductImage,
  Cart,
  CartItem,
  Address,
  Order,
  OrderItem,
];