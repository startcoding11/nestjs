## **📦 E-commerce Entity Phasing Plan**

### **Phase 1: Auth & Shops (5 entities)**
*Core infrastructure - users, roles, and storefronts*

1. **User** - Core user account linked to Supertokens. *Connects to: Profiles, Shops, ShopWorkers*
2. **CustomerProfile** - Customer-specific data (loyalty points, preferences, default addresses). *Connects to: User*
3. **WorkerProfile** - Staff data (employee ID, hire date, permissions). *Connects to: User*
4. **Shop** - Storefront owned by a user. *Connects to: Owner (User), Workers*
5. **ShopWorker** - Junction: which users work at which shops with what roles. *Connects to: User, Shop*

No e-commerce without users and shops.

---

### **Phase 2: Product Catalog (3 entities)**
*What you sell*

6. **Category** - Hierarchical product organization (Electronics > Laptops). *Connects to: Parent Category, Products*
7. **Product** - Sellable items with JSON variants (no separate variant table yet). *Connects to: Shop, Categories, Images*
8. **ProductImage** - Product photos with display order and primary flag. *Connects to: Product*

Products are independent of carts and orders. Build catalog first.

---

### **Phase 3: Cart & Checkout (3 entities)**
*How customers collect items and where they ship*

9. **Cart** - Temporary shopping cart (authenticated user or guest session). *Connects to: User (optional), CartItems*
10. **CartItem** - Products in cart with quantity and selected variants. *Connects to: Cart, Product*
11. **Address** - Reusable shipping/billing addresses. *Connects to: User, referenced by CustomerProfile and Order*

Carts need Products, Addresses need Users. Build these after catalog is ready.

---

### **Phase 4: Orders & Payments (2 entities)**
*Completed purchases*

12. **Order** - Completed purchase with status, totals, and payment info. *Connects to: Customer (User), Addresses, OrderItems*
13. **OrderItem** - Snapshot of product at time of purchase (preserves price, name, variants). *Connects to: Order, Product*

 Orders depend on everything else: Users, Products, Addresses, Carts.

---


**Features:**

- ✅ Multi-user authentication
- ✅ Role-based access (customer, seller, manager, owner)
- ✅ Multi-tenant shops
- ✅ Worker management per shop

- ✅ Hierarchical categories
- ✅ Product catalog with simple variants
- ✅ Product images
- ✅ Shopping cart (guest + authenticated)
- ✅ Order processing
- ✅ Order history
- ✅ Address management
- ✅ Inventory tracking


