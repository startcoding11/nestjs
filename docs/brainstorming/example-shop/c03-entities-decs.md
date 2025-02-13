# TypeORM Entities - Complete Documentation

## 📊 Entity Overview

Total Entities: **13**

### Phase 1: User Management & Shops (5 entities)
1. ✅ **User** - Core authentication
2. ✅ **CustomerProfile** - Customer-specific data
3. ✅ **WorkerProfile** - Staff data
4. ✅ **Shop** - Store/shop entity
5. ✅ **ShopWorker** - Junction table for shop access

### Phase 2: E-commerce Core (8 entities)
6. ✅ **Category** - Hierarchical categories
7. ✅ **Product** - Products with JSON variants
8. ✅ **ProductImage** - Product photos
9. ✅ **Cart** - Shopping carts
10. ✅ **CartItem** - Items in cart
11. ✅ **Address** - Customer addresses
12. ✅ **Order** - Customer orders
13. ✅ **OrderItem** - Order line items

---

## 🎯 Key Features

### ✨ All Entities Include:

**1. Validation Decorators**
```typescript
@IsEmail()
@Length(1, 255)
@IsNumber()
@Min(0)
@IsEnum(UserRole)
```

**2. Proper Indexes**
```typescript
@Index('idx_email', ['email'])
@Index('idx_slug', ['slug'])
```

**3. Relationships**
```typescript
@OneToMany()
@ManyToOne()
@OneToOne()
@ManyToMany()
```

**4. Computed Properties**
```typescript
get fullName(): string
get inStock(): boolean
get isVip(): boolean
```

**5. TypeScript Types**
```typescript
export interface ProductVariants {
  [key: string]: string[];
}
```

---

## 📁 File Structure

```
entities/
├── base.entity.ts                  # Abstract base class
├── user.entity.ts                  # User + UserRole enum
├── customer-profile.entity.ts      # Customer profile
├── worker-profile.entity.ts        # Worker profile
├── shop.entity.ts                  # Shop
├── shop-shop-worker.entity.ts           # ShopWorker + ShopWorkerRole enum
├── category.entity.ts              # Category (hierarchical)
├── product.entity.ts               # Product + interfaces
├── product-image.entity.ts         # ProductImage
├── cart.entity.ts                  # Cart + CartStatus enum
├── cart-item.entity.ts             # CartItem + SelectedVariants interface
├── address.entity.ts               # Address
├── order.entity.ts                 # Order + OrderStatus/PaymentStatus enums
├── order-item.entity.ts            # OrderItem
└── index.ts                        # Export all entities
```

---

## 🔗 Relationship Diagram

```
User
├── CustomerProfile (1:1)
├── WorkerProfile (1:1)
├── Shop[] (1:N as owner)
├── ShopWorker[] (1:N)
├── Cart[] (1:N)
├── Order[] (1:N)
└── Address[] (1:N)

Shop
├── User (N:1 owner)
├── ShopWorker[] (1:N)
└── Product[] (1:N)

Category
├── Category (N:1 parent, self-referential)
├── Category[] (1:N children)
└── Product[] (N:M)

Product
├── Shop (N:1)
├── Category[] (N:M)
├── ProductImage[] (1:N)
├── CartItem[] (1:N)
└── OrderItem[] (1:N)

Cart
├── User (N:1, nullable)
└── CartItem[] (1:N)

Order
├── User (N:1)
├── Address (N:1 shipping)
├── Address (N:1 billing)
└── OrderItem[] (1:N)
```

---

## 🎨 Special Features

### **1. Simple JSON Variants**

**In Product:**
```typescript
variants: ProductVariants; // { "sizes": ["S", "M", "L"], "colors": ["Red"] }
```

**In CartItem/OrderItem:**
```typescript
selectedVariants: SelectedVariants; // { "size": "M", "color": "Red" }
```

### **2. Hierarchical Categories**
```typescript
@ManyToOne(() => Category, (category) => category.children)
parent?: Category;

@OneToMany(() => Category, (category) => category.parent)
children: Category[];
```

### **3. Guest Cart Support**
```typescript
userId?: string;        // For authenticated users
sessionId?: string;     // For guest users
@Check(`user_id IS NOT NULL OR session_id IS NOT NULL`)
```

### **4. Order Number Auto-generation**
```typescript
@BeforeInsert()
generateOrderNumber() {
  // Generates: ORD-2024-00001
}
```

### **5. Computed Properties**

**User:**
- `fullName`
- `isCustomer`
- `isWorker`
- `isAdmin`

**Product:**
- `inStock`
- `isLowStock`
- `discountPercentage`
- `profitMargin`
- `hasVariants`
- `variantCombinations`

**Cart:**
- `totalItems`
- `subtotal`
- `isEmpty`
- `isExpired`

**Order:**
- `isPending`
- `isShipped`
- `canBeCancelled`
- `processingTime`
- `deliveryTime`

---

## 🔧 Usage Examples

### **Import Entities**
```typescript
import {
  User,
  Product,
  Cart,
  Order,
  entities, // All entities array
} from './entities';
```

### **TypeORM Configuration**
```typescript
import { entities } from './entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'shop_user',
  password: 'shop_password',
  database: 'online_shop',
  entities: entities,
  synchronize: false, // Use migrations
  logging: true,
};
```

### **Create User with Profile**
```typescript
const user = new User();
user.supertokensUserId = 'st_user_123';
user.email = 'john@example.com';
user.firstName = 'John';
user.lastName = 'Doe';
user.role = UserRole.CUSTOMER;

const profile = new CustomerProfile();
profile.userId = user.id;
profile.loyaltyPoints = 0;

await userRepository.save(user);
await profileRepository.save(profile);
```

### **Create Product with Variants**
```typescript
const product = new Product();
product.shopId = shop.id;
product.name = 'Premium T-Shirt';
product.slug = 'premium-tshirt';
product.price = 29.99;
product.variants = {
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Black', 'White', 'Navy']
};
product.stockQuantity = 100;

await productRepository.save(product);
```

### **Add to Cart with Variants**
```typescript
const cartItem = new CartItem();
cartItem.cartId = cart.id;
cartItem.productId = product.id;
cartItem.quantity = 2;
cartItem.selectedVariants = {
  size: 'M',
  color: 'Black'
};
cartItem.unitPrice = product.price;

await cartItemRepository.save(cartItem);
```

### **Create Order from Cart**
```typescript
const order = new Order();
order.userId = user.id;
order.shippingAddressId = address.id;
order.billingAddressId = address.id;
order.status = OrderStatus.PENDING;
order.paymentStatus = PaymentStatus.PENDING;
order.subtotal = cart.subtotal;
order.total = cart.subtotal + shipping;

// Convert cart items to order items
order.items = cart.items.map(cartItem => {
  const orderItem = new OrderItem();
  orderItem.productId = cartItem.productId;
  orderItem.productName = cartItem.product.name;
  orderItem.quantity = cartItem.quantity;
  orderItem.selectedVariants = cartItem.selectedVariants;
  orderItem.unitPrice = cartItem.unitPrice;
  orderItem.totalPrice = cartItem.lineTotal;
  return orderItem;
});

await orderRepository.save(order);
```

---

## ✅ Validation

All entities include:
- ✅ Proper column types matching SQL schema
- ✅ Correct relationships with cascade options
- ✅ Indexes matching database indexes
- ✅ Validation decorators (class-validator)
- ✅ TypeScript types and interfaces
- ✅ Computed properties for business logic
- ✅ Proper foreign key constraints
- ✅ Check constraints where needed
- ✅ Default values
- ✅ Nullable fields marked correctly

---

## 🚀 Next Steps

1. **Copy entities to your project:**
   ```bash
   cp entities/* src/domain/
   ```

2. **Update TypeORM DataSource:**
   ```typescript
   import { entities } from './domain/entities';
   ```

3. **Generate migrations:**
   ```bash
   npm run migration:generate -- InitialSchema
   ```

4. **Run migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start using entities in services!**

---

## 📝 Notes

- **No TypeORM Synchronize**: Always use migrations for schema changes
- **UUID Primary Keys**: Better for distributed systems
- **JSON Columns**: Simple variants, no separate tables needed
- **Cascade Options**: Carefully set (CASCADE, RESTRICT, SET NULL)
- **Indexes**: All important queries are indexed
- **Enums**: Type-safe status fields
- **Computed Properties**: Business logic in entities
- **Validation**: class-validator decorators ready

---

## 🎯 Perfect Match with SQL Schema

Every entity matches the SQL schema exactly:
- ✅ Column names (with snake_case in DB, camelCase in code)
- ✅ Data types
- ✅ Constraints
- ✅ Indexes
- ✅ Relationships
- ✅ Default values
- ✅ Nullable fields

**Ready for production! 🚀**