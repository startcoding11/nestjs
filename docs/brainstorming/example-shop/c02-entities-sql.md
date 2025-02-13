## 🎯 Final Entity List (Phase 1 + Phase 2)

### **Phase 1: Foundation (5 entities)**

1. User
2. CustomerProfile
3. WorkerProfile
4. Shop
5. ShopWorker

### **Phase 2: E-commerce Core (8 entities)**

6. Category
7. Product (with simple variants as JSON)
8. ProductImage
9. Cart
10. CartItem
11. Order
12. OrderItem
13. Address

**Total: 13 entities** - Perfect for a portfolio!

---

## 📐 Detailed Entity Schemas

Let me show you the complete structure with relationships:

### **1. User** (Phase 1)

```typescript
User
{
  id: UUID(PK)
  supertokens_user_id: string(unique, indexed)
  email: string(unique, indexed)
  email_verified: boolean

  // Profile
  first_name: string
  last_name: string
  phone: string ?
    avatar_url : string ?

      // Role & Status
      role : `enum` (customer, seller, manager, owner)
  is_active: boolean

  // Metadata
  metadata: JSON ?

    // Timestamps
    created_at : timestamp
  updated_at: timestamp

  // Relations
  customer_profile ? : CustomerProfile(OneToOne)
  worker_profile ? : WorkerProfile(OneToOne)
  owned_shops: Shop[](OneToMany)
  shop_workers: ShopWorker[](OneToMany)
  carts: Cart[](OneToMany)
  orders: Order[](OneToMany)
  addresses: Address[](OneToMany)
}
```

### **2. CustomerProfile** (Phase 1)

```typescript
CustomerProfile
{
  user_id: UUID(PK, FK → User
)

  // Customer-specific
  date_of_birth: date ?
    preferences : JSON ? // shopping preferences, sizes, etc.

      // Default addresses
      default_shipping_address_id : UUID ? (FK → Address
)
  default_billing_address_id: UUID ? (FK → Address
)

  // Loyalty
  loyalty_points: number(
default:
  0
)
  total_spent: decimal(
default:
  0
)

  // Timestamps
  created_at: timestamp
  updated_at: timestamp

  // Relations
  user: User(OneToOne)
}
```

### **3. WorkerProfile** (Phase 1)

```typescript
WorkerProfile
{
  user_id: UUID(PK, FK → User
)

  // Worker details
  employee_id: string ? (unique)
    hire_date
:
  date ?
    department : string ?

      // Permissions
      permissions : JSON ? // custom permissions

        // Timestamps
        created_at : timestamp
  updated_at: timestamp

  // Relations
  user: User(OneToOne)
}
```

### **4. Shop** (Phase 1)

```typescript
Shop
{
  id: UUID(PK)
  owner_id: UUID(FK → User, indexed
)

  // Basic info
  name: string
  slug: string(unique, indexed)
  description: text ?
    logo_url : string ?

      // Contact
      contact_email : string
  contact_phone: string ?

    // Address (simple for Phase 1)
    address_line1 : string ?
      address_line2 : string ?
        city : string ?
          state : string ?
            postal_code : string ?
              country : string ?

                // Status
                is_active : boolean(
default:
  true
)
  is_verified: boolean(
default:
  false
)

  // Settings
  settings: JSON ? // shop-specific settings

    // Timestamps
    created_at : timestamp
  updated_at: timestamp

  // Relations
  owner: User(ManyToOne)
  workers: ShopWorker[](OneToMany)
  products: Product[](OneToMany)
}
```

### **5. ShopWorker** (Phase 1)

```typescript
ShopWorker
{
  id: UUID(PK)
  shop_id: UUID(FK → Shop, indexed
)
  user_id: UUID(FK → User, indexed
)

  // Role at this shop
  role: enum
  (seller, manager, owner)

  // Status
  is_active: boolean(
default:
  true
)

  // Timestamps
  invited_at: timestamp ?
    joined_at : timestamp ?
      created_at : timestamp
  updated_at: timestamp

  // Unique constraint
  UNIQUE(shop_id, user_id)

  // Relations
  shop: Shop(ManyToOne)
  user: User(ManyToOne)
}
```

---

### **6. Category** (Phase 2)

```typescript
Category
{
  id: UUID(PK)

  // Hierarchy (self-referential)
  parent_id: UUID ? (FK → Category
)

  // Info
  name: string
  slug: string(unique, indexed)
  description: text ?
    image_url : string ?

      // Display
      display_order : number(
default:
  0
)
  is_active: boolean(
default:
  true
)

  // SEO
  meta_title: string ?
    meta_description : string ?

      // Timestamps
      created_at : timestamp
  updated_at: timestamp

  // Relations
  parent ? : Category(ManyToOne)
  children: Category[](OneToMany)
  products: Product[](ManyToMany)
}
```

### **7. Product** (Phase 2) ⭐ **With Simple Variants**

```typescript
Product
{
  id: UUID(PK)
  shop_id: UUID(FK → Shop, indexed
)

  // Basic info
  name: string
  slug: string(indexed)
  description: text ?
    short_description : string ?

      // Pricing (base price)
      price : decimal
  compare_at_price: decimal ? // original price for discounts
    cost_price : decimal ? // for profit calculations

      // ⭐ SIMPLE VARIANTS (JSON)
      // Example: 
      // {
      //   "sizes": ["S", "M", "L", "XL"],
      //   "colors": ["Red", "Blue", "Black"],
      //   "material": ["Cotton", "Polyester"]
      // }
      variants : JSON ?

        // Inventory (simple)
        stock_quantity : number(
default:
  0
)
  sku: string ? (unique)
    barcode
:
  string ?

    // Tracking
    track_inventory : boolean(
default:
  true
)
  allow_backorder: boolean(
default:
  false
)
  low_stock_threshold: number ? (
default:
  10
)

  // Physical attributes
  weight: decimal ? // in kg
    dimensions : JSON ? // { length, width, height } in cm

      // Status
      is_active : boolean(
default:
  true
)
  is_featured: boolean(
default:
  false
)

  // SEO
  meta_title: string ?
    meta_description : string ?

      // Stats (denormalized for performance)
      view_count : number(
default:
  0
)
  order_count: number(
default:
  0
)
  average_rating: decimal ? (
default:
  null
)

  // Timestamps
  created_at: timestamp
  updated_at: timestamp
  published_at: timestamp ?

    // Relations
    shop : Shop(ManyToOne)
  categories: Category[](ManyToMany)
  images: ProductImage[](OneToMany)
  cart_items: CartItem[](OneToMany)
  order_items: OrderItem[](OneToMany)
}
```

### **8. ProductImage** (Phase 2)

```typescript
ProductImage
{
  id: UUID(PK)
  product_id: UUID(FK → Product, indexed
)

  // Image data
  url: string
  alt_text: string ?

    // Display
    display_order : number(
default:
  0
)
  is_primary: boolean(
default:
  false
)

  // Timestamps
  created_at: timestamp

  // Relations
  product: Product(ManyToOne)
}
```

### **9. Cart** (Phase 2)

```typescript
Cart
{
  id: UUID(PK)

  // Ownership
  user_id: UUID ? (FK → User, indexed
) // null for guest
  session_id: string ? (indexed) // for guest carts

    // Status
    status
:

  enum

  (active, abandoned, converted)

  // Expiry (cleanup old carts)
  expires_at: timestamp

  // Timestamps
  created_at: timestamp
  updated_at: timestamp

  // Relations
  user ? : User(ManyToOne)
  items: CartItem[](OneToMany)

  // Constraints
  CHECK: user_id
  IS
  NOT
  NULL
  OR
  session_id
  IS
  NOT
  NULL
}
```

### **10. CartItem** (Phase 2)

```typescript
CartItem
{
  id: UUID(PK)
  cart_id: UUID(FK → Cart, indexed
)
  product_id: UUID(FK → Product, indexed
)

  // Selection
  quantity: number(min
:
  1
)

  // ⭐ SELECTED VARIANTS (JSON)
  // Example: { "size": "M", "color": "Red" }
  selected_variants: JSON ?

    // Price snapshot (at time of adding to cart)
    unit_price : decimal

  // Timestamps
  created_at: timestamp
  updated_at: timestamp

  // Relations
  cart: Cart(ManyToOne)
  product: Product(ManyToOne)

  // Unique constraint
  UNIQUE(cart_id, product_id, selected_variants)
}
```

### **11. Order** (Phase 2)

```typescript
Order
{
  id: UUID(PK)
  order_number: string(unique, indexed) // ORD-2024-00001

  // Customer
  user_id: UUID(FK → User, indexed
)

  // Addresses
  shipping_address_id: UUID(FK → Address
)
  billing_address_id: UUID(FK → Address
)

  // Status
  status: enum
  (
    pending,
      processing,
      confirmed,
      shipped,
      delivered,
      cancelled,
      refunded
  )

  // Payment
  payment_status: enum
  (pending, paid, failed, refunded)
  payment_method: string ? // stripe, paypal, cod

    // Amounts
    subtotal : decimal
  tax: decimal(
default:
  0
)
  shipping_cost: decimal(
default:
  0
)
  discount: decimal(
default:
  0
)
  total: decimal

  // Customer notes
  customer_note: text ?

    // Admin notes
    admin_note : text ?

      // Tracking
      tracking_number : string ?
        carrier : string ? // UPS, FedEx, etc.

          // Timestamps
          created_at : timestamp
  updated_at: timestamp
  confirmed_at: timestamp ?
    shipped_at : timestamp ?
      delivered_at : timestamp ?
        cancelled_at : timestamp ?

          // Relations
          user : User(ManyToOne)
  items: OrderItem[](OneToMany)
  shipping_address: Address(ManyToOne)
  billing_address: Address(ManyToOne)
}
```

### **12. OrderItem** (Phase 2)

```typescript
OrderItem
{
  id: UUID(PK)
  order_id: UUID(FK → Order, indexed
)
  product_id: UUID(FK → Product, indexed
)

  // Snapshot data (preserve at time of order)
  product_name: string
  product_sku: string ?

    // Selection
    quantity : number

  // ⭐ SELECTED VARIANTS (JSON)
  // Example: { "size": "M", "color": "Red" }
  selected_variants: JSON ?

    // Pricing (snapshot)
    unit_price : decimal
  total_price: decimal // quantity * unit_price

  // Timestamps
  created_at: timestamp

  // Relations
  order: Order(ManyToOne)
  product: Product(ManyToOne)
}
```

### **13. Address** (Phase 2)

```typescript
Address
{
  id: UUID(PK)
  user_id: UUID(FK → User, indexed
)

  // Address details
  label: string ? // "Home", "Work", etc.
    full_name : string
  phone: string

  address_line1: string
  address_line2: string ?
    city : string
  state: string
  postal_code: string
  country: string

  // Flags
  is_default_shipping: boolean(
default:
  false
)
  is_default_billing: boolean(
default:
  false
)

  // Timestamps
  created_at: timestamp
  updated_at: timestamp

  // Relations
  user: User(ManyToOne)
}
```

---

## 🔗 Junction Tables (Many-to-Many)

### **ProductCategory** (implicit)

```typescript
product_categories
{
  product_id: UUID(FK → Product
)
  category_id: UUID(FK → Category
)

  PRIMARY
  KEY(product_id, category_id)
}
```

---

## 📊 Indexes Summary

**Critical indexes for performance:**

```sql
-- Users
CREATE INDEX idx_user_email ON users (email);
CREATE INDEX idx_user_supertokens_id ON users (supertokens_user_id);
CREATE INDEX idx_user_role ON users (role);

-- Shops
CREATE INDEX idx_shop_slug ON shops (slug);
CREATE INDEX idx_shop_owner ON shops (owner_id);

-- Products
CREATE INDEX idx_product_shop ON products (shop_id);
CREATE INDEX idx_product_slug ON products (slug);
CREATE INDEX idx_product_sku ON products (sku);
CREATE INDEX idx_product_active ON products (is_active);

-- Categories
CREATE INDEX idx_category_slug ON categories (slug);
CREATE INDEX idx_category_parent ON categories (parent_id);

-- Orders
CREATE INDEX idx_order_user ON orders (user_id);
CREATE INDEX idx_order_number ON orders (order_number);
CREATE INDEX idx_order_status ON orders (status);
CREATE INDEX idx_order_created ON orders (created_at);

-- Carts
CREATE INDEX idx_cart_user ON carts (user_id);
CREATE INDEX idx_cart_session ON carts (session_id);
```

---

## 🎨 Simple Variants Example Usage

### **Product with Variants:**

```json
{
  "name": "Premium T-Shirt",
  "price": 29.99,
  "variants": {
    "size": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "color": [
      "Black",
      "White",
      "Navy"
    ]
  },
  "stock_quantity": 100
}
```

### **CartItem with Selected Variants:**

```json
{
  "product_id": "uuid-123",
  "quantity": 2,
  "selected_variants": {
    "size": "M",
    "color": "Black"
  },
  "unit_price": 29.99
}
```

### **OrderItem Snapshot:**

```json
{
  "product_name": "Premium T-Shirt",
  "quantity": 2,
  "selected_variants": {
    "size": "M",
    "color": "Black"
  },
  "unit_price": 29.99,
  "total_price": 59.98
}
```

---

## ✅ What This Gives You

**Phase 1 Features:**

- ✅ Multi-user authentication
- ✅ Role-based access (customer, seller, manager, owner)
- ✅ Multi-tenant shops
- ✅ Worker management per shop

**Phase 2 Features:**

- ✅ Hierarchical categories
- ✅ Product catalog with simple variants
- ✅ Product images
- ✅ Shopping cart (guest + authenticated)
- ✅ Order processing
- ✅ Order history
- ✅ Address management
- ✅ Inventory tracking

**Total Complexity:**

- 13 entities
- ~100-120 database columns
- 15+ relationships
- Perfect portfolio scope!

