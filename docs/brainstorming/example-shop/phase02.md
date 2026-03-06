## **Phase 2 **

### **First: AuthModule (Highest Priority)**

You need authentication before anything else:

```yaml
Priority: 🔥 HIGH
Why: You can't test shops, products, or orders without users
```

**What needs to be built:**

1. **AuthDomainModule** - Service for register/login logic
2. **AuthController** - Endpoints for /auth/register, /auth/login
3. **Supertokens middleware** - To handle sessions
4. **Test the flow** - Register → Login → Access protected user endpoint

---

### **Second: ShopModule**

```yaml
Priority: 📦 MEDIUM
Why: Products need shops, orders need shops
```

**What needs to be built:**

1. **ShopDomainModule** - Business logic for shops
2. **ShopController** - Endpoints for creating/updating shops
3. **ShopWorker logic** - Assigning workers to shops

---

### **Third: Product Catalog**

```yaml
Priority: 📦 MEDIUM
Why: Core e-commerce functionality
```

**What needs to be built:**

1. **CategoryModule** - Product categorization
2. **ProductModule** - Products with JSON variants
3. **ProductImageModule** - Product photos

---

### **Fourth: Cart & Checkout**

```yaml
Priority: 📦 MEDIUM
Why: Customers need to buy things
```

**What needs to be built:**

1. **CartModule** - Shopping cart
2. **AddressModule** - Shipping/billing addresses

---

### **Fifth: Orders**

```yaml
Priority: 📦 MEDIUM
Why: Complete the purchase flow
```

**What needs to be built:**

1. **OrderModule** - Order creation and management
2. **OrderItemModule** - Order line items

---

### **📋 Phase 2 Order**

| Step | Module | Why First |
|------|--------|-----------|
| 1 | **AuthModule** | Need users before anything else |
| 2 | **ShopModule** | Products need shops |
| 3 | **Product/Category** | Core sellable items |
| 4 | **Cart/Address** | Shopping experience |
| 5 | **Order** | Complete the purchase |
