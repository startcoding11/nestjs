-- ============================================================================
-- Online Shop Database Schema
-- MySQL 8.0+
-- ============================================================================
-- Phase 1: User Management & Shops
-- Phase 2: Products, Cart, Orders
-- ============================================================================

-- Drop existing database if needed (CAUTION: This will delete all data!)
-- DROP DATABASE IF EXISTS online_shop;

-- Create database
CREATE DATABASE IF NOT EXISTS playground
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE playground;

-- ============================================================================
-- PHASE 1: USER MANAGEMENT & AUTHENTICATION
-- ============================================================================

-- Users table (core authentication linked to Supertokens)
CREATE TABLE users
(
    id                  CHAR(36) PRIMARY KEY                            DEFAULT (UUID()),
    supertokens_user_id VARCHAR(128) UNIQUE NOT NULL,

    -- Contact information
    email               VARCHAR(255) UNIQUE NOT NULL,
    email_verified      BOOLEAN                                         DEFAULT FALSE,

    -- Profile information
    first_name          VARCHAR(100),
    last_name           VARCHAR(100),
    phone               VARCHAR(20),
    avatar_url          VARCHAR(500),

    -- Role management
    role                ENUM ('customer', 'seller', 'manager', 'owner') DEFAULT 'customer',
    is_active           BOOLEAN                                         DEFAULT TRUE,

    -- Flexible metadata for future extensions
    metadata            JSON,

    -- Timestamps
    created_at          TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_supertokens_id (supertokens_user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_active (is_active)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Customer profiles (extends users for customers)
CREATE TABLE customer_profiles
(
    user_id                     CHAR(36) PRIMARY KEY,

    -- Customer-specific fields
    date_of_birth               DATE,
    preferences                 JSON, -- Shopping preferences, saved sizes, etc.

    -- Default addresses (will be set after addresses table is created)
    default_shipping_address_id CHAR(36) NULL,
    default_billing_address_id  CHAR(36) NULL,

    -- Loyalty and lifetime value
    loyalty_points              INT            DEFAULT 0,
    total_spent                 DECIMAL(10, 2) DEFAULT 0.00,

    -- Timestamps
    created_at                  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_total_spent (total_spent),
    INDEX idx_loyalty_points (loyalty_points)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Worker profiles (base for sellers, managers, owners)
CREATE TABLE worker_profiles
(
    user_id     CHAR(36) PRIMARY KEY,

    -- Worker-specific fields
    employee_id VARCHAR(50) UNIQUE,
    hire_date   DATE,
    department  VARCHAR(100),

    -- Permissions (JSON for flexibility)
    permissions JSON,

    -- Timestamps
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_employee_id (employee_id),
    INDEX idx_hire_date (hire_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Shops table
CREATE TABLE shops
(
    id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    owner_id      CHAR(36)            NOT NULL,

    -- Basic shop information
    name          VARCHAR(255)        NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    description   TEXT,
    logo_url      VARCHAR(500),

    -- Contact information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),

    -- Physical address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city          VARCHAR(100),
    state         VARCHAR(100),
    postal_code   VARCHAR(20),
    country       VARCHAR(100),

    -- Status
    is_active     BOOLEAN              DEFAULT TRUE,
    is_verified   BOOLEAN              DEFAULT FALSE,

    -- Settings (JSON for flexibility)
    settings      JSON,

    -- Timestamps
    created_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE RESTRICT,

    -- Indexes
    INDEX idx_owner (owner_id),
    INDEX idx_slug (slug),
    INDEX idx_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Shop workers (junction table: who works at which shop)
CREATE TABLE shop_workers
(
    id         CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    shop_id    CHAR(36)                            NOT NULL,
    user_id    CHAR(36)                            NOT NULL,

    -- Role at this specific shop
    role       ENUM ('seller', 'manager', 'owner') NOT NULL,

    -- Status
    is_active  BOOLEAN              DEFAULT TRUE,

    -- Timestamps
    invited_at TIMESTAMP                           NULL,
    joined_at  TIMESTAMP                           NULL,
    created_at TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE KEY unique_shop_user (shop_id, user_id),

    -- Indexes
    INDEX idx_user_shops (user_id),
    INDEX idx_shop_workers (shop_id),
    INDEX idx_role (role),

    -- Foreign keys
    FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ============================================================================
-- PHASE 2: PRODUCT CATALOG
-- ============================================================================

-- Categories (hierarchical, self-referential)
CREATE TABLE categories
(
    id               CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    -- Hierarchy
    parent_id        CHAR(36)            NULL,

    -- Basic information
    name             VARCHAR(255)        NOT NULL,
    slug             VARCHAR(255) UNIQUE NOT NULL,
    description      TEXT,
    image_url        VARCHAR(500),

    -- Display settings
    display_order    INT                  DEFAULT 0,
    is_active        BOOLEAN              DEFAULT TRUE,

    -- SEO
    meta_title       VARCHAR(255),
    meta_description TEXT,

    -- Timestamps
    created_at       TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key (self-referential)
    FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL,

    -- Indexes
    INDEX idx_parent (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products
(
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    shop_id             CHAR(36)       NOT NULL,

    -- Basic information
    name                VARCHAR(255)   NOT NULL,
    slug                VARCHAR(255)   NOT NULL,
    description         TEXT,
    short_description   VARCHAR(500),

    -- Pricing
    price               DECIMAL(10, 2) NOT NULL,
    compare_at_price    DECIMAL(10, 2) NULL, -- Original price for discounts
    cost_price          DECIMAL(10, 2) NULL, -- For profit calculations

    -- Simple variants (JSON)
    -- Example: {"sizes": ["S", "M", "L"], "colors": ["Red", "Blue"]}
    variants            JSON,

    -- Inventory management
    stock_quantity      INT                  DEFAULT 0,
    sku                 VARCHAR(100) UNIQUE,
    barcode             VARCHAR(100),

    -- Inventory settings
    track_inventory     BOOLEAN              DEFAULT TRUE,
    allow_backorder     BOOLEAN              DEFAULT FALSE,
    low_stock_threshold INT                  DEFAULT 10,

    -- Physical attributes
    weight              DECIMAL(8, 2),       -- in kg
    dimensions          JSON,                -- {"length": 10, "width": 5, "height": 3} in cm

    -- Status
    is_active           BOOLEAN              DEFAULT TRUE,
    is_featured         BOOLEAN              DEFAULT FALSE,

    -- SEO
    meta_title          VARCHAR(255),
    meta_description    TEXT,

    -- Statistics (denormalized for performance)
    view_count          INT                  DEFAULT 0,
    order_count         INT                  DEFAULT 0,
    average_rating      DECIMAL(3, 2)  NULL,

    -- Timestamps
    created_at          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at        TIMESTAMP      NULL,

    -- Foreign keys
    FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_shop (shop_id),
    INDEX idx_slug (slug),
    INDEX idx_sku (sku),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price),
    INDEX idx_created_at (created_at),
    INDEX idx_stock (stock_quantity),

    -- Full-text search
    FULLTEXT INDEX ft_product_search (name, description, short_description)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Product-Category junction table (many-to-many)
CREATE TABLE product_categories
(
    product_id  CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,

    -- Timestamps
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Primary key
    PRIMARY KEY (product_id, category_id),

    -- Foreign keys
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_category_products (category_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Product images
CREATE TABLE product_images
(
    id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id    CHAR(36)     NOT NULL,

    -- Image data
    url           VARCHAR(500) NOT NULL,
    alt_text      VARCHAR(255),

    -- Display settings
    display_order INT                  DEFAULT 0,
    is_primary    BOOLEAN              DEFAULT FALSE,

    -- Timestamps
    created_at    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_product (product_id),
    INDEX idx_display_order (display_order),
    INDEX idx_primary (is_primary)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ============================================================================
-- PHASE 2: SHOPPING CART
-- ============================================================================

-- Carts (supports both authenticated and guest users)
CREATE TABLE carts
(
    id         CHAR(36) PRIMARY KEY                      DEFAULT (UUID()),

    -- Ownership (either user_id or session_id must be set)
    user_id    CHAR(36)     NULL,
    session_id VARCHAR(255) NULL,

    -- Status
    status     ENUM ('active', 'abandoned', 'converted') DEFAULT 'active',

    -- Expiry for cleanup
    expires_at TIMESTAMP    NOT NULL,

    -- Timestamps
    created_at TIMESTAMP                                 DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP                                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    -- Constraints
    CHECK (user_id IS NOT NULL OR session_id IS NOT NULL),

    -- Indexes
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_status (status),
    INDEX idx_expires (expires_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Cart items
CREATE TABLE cart_items
(
    id                CHAR(36) PRIMARY KEY    DEFAULT (UUID()),
    cart_id           CHAR(36)       NOT NULL,
    product_id        CHAR(36)       NOT NULL,

    -- Selection
    quantity          INT            NOT NULL DEFAULT 1,

    -- Selected variants (JSON)
    -- Example: {"size": "M", "color": "Red"}
    selected_variants JSON,

    -- Price snapshot (at time of adding to cart)
    unit_price        DECIMAL(10, 2) NOT NULL,

    -- Timestamps
    created_at        TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,

    -- Constraints
    CHECK (quantity > 0),

    -- Indexes
    INDEX idx_cart (cart_id),
    INDEX idx_product (product_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ============================================================================
-- PHASE 2: ADDRESSES
-- ============================================================================

-- Customer addresses
CREATE TABLE addresses
(
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id             CHAR(36)     NOT NULL,

    -- Address details
    label               VARCHAR(50), -- "Home", "Work", "Office", etc.
    full_name           VARCHAR(255) NOT NULL,
    phone               VARCHAR(20)  NOT NULL,

    -- Address fields
    address_line1       VARCHAR(255) NOT NULL,
    address_line2       VARCHAR(255),
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL,
    postal_code         VARCHAR(20)  NOT NULL,
    country             VARCHAR(100) NOT NULL,

    -- Default flags
    is_default_shipping BOOLEAN              DEFAULT FALSE,
    is_default_billing  BOOLEAN              DEFAULT FALSE,

    -- Timestamps
    created_at          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_user (user_id),
    INDEX idx_default_shipping (is_default_shipping),
    INDEX idx_default_billing (is_default_billing)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Add foreign keys to customer_profiles for default addresses
ALTER TABLE customer_profiles
    ADD CONSTRAINT fk_default_shipping_address
        FOREIGN KEY (default_shipping_address_id) REFERENCES addresses (id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_default_billing_address
        FOREIGN KEY (default_billing_address_id) REFERENCES addresses (id) ON DELETE SET NULL;

-- ============================================================================
-- PHASE 2: ORDERS
-- ============================================================================

-- Orders table
CREATE TABLE orders
(
    id                  CHAR(36) PRIMARY KEY                           DEFAULT (UUID()),
    order_number        VARCHAR(50) UNIQUE NOT NULL, -- ORD-2024-00001

    -- Customer
    user_id             CHAR(36)           NOT NULL,

    -- Addresses (snapshot at time of order)
    shipping_address_id CHAR(36)           NOT NULL,
    billing_address_id  CHAR(36)           NOT NULL,

    -- Status tracking
    status              ENUM (
        'pending',
        'processing',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
        )                                                              DEFAULT 'pending',

    -- Payment
    payment_status      ENUM ('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method      VARCHAR(50),                 -- 'stripe', 'paypal', 'cod', etc.

    -- Financial breakdown
    subtotal            DECIMAL(10, 2)     NOT NULL,
    tax                 DECIMAL(10, 2)                                 DEFAULT 0.00,
    shipping_cost       DECIMAL(10, 2)                                 DEFAULT 0.00,
    discount            DECIMAL(10, 2)                                 DEFAULT 0.00,
    total               DECIMAL(10, 2)     NOT NULL,

    -- Notes
    customer_note       TEXT,
    admin_note          TEXT,

    -- Shipping tracking
    tracking_number     VARCHAR(100),
    carrier             VARCHAR(100),                -- 'UPS', 'FedEx', 'DHL', etc.

    -- Timestamps
    created_at          TIMESTAMP                                      DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at        TIMESTAMP          NULL,
    shipped_at          TIMESTAMP          NULL,
    delivered_at        TIMESTAMP          NULL,
    cancelled_at        TIMESTAMP          NULL,

    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    FOREIGN KEY (shipping_address_id) REFERENCES addresses (id) ON DELETE RESTRICT,
    FOREIGN KEY (billing_address_id) REFERENCES addresses (id) ON DELETE RESTRICT,

    -- Indexes
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_confirmed_at (confirmed_at),
    INDEX idx_tracking (tracking_number)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Order items (snapshot of products at time of purchase)
CREATE TABLE order_items
(
    id                CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id          CHAR(36)       NOT NULL,
    product_id        CHAR(36)       NOT NULL,

    -- Product snapshot (preserve data even if product changes)
    product_name      VARCHAR(255)   NOT NULL,
    product_sku       VARCHAR(100),

    -- Quantity and variants
    quantity          INT            NOT NULL,

    -- Selected variants (JSON snapshot)
    -- Example: {"size": "M", "color": "Red"}
    selected_variants JSON,

    -- Pricing snapshot
    unit_price        DECIMAL(10, 2) NOT NULL,
    total_price       DECIMAL(10, 2) NOT NULL, -- quantity * unit_price

    -- Timestamps
    created_at        TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,

    -- Constraints
    CHECK (quantity > 0),
    CHECK (total_price = quantity * unit_price),

    -- Indexes
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ============================================================================
-- TRIGGERS & PROCEDURES
-- ============================================================================

# -- Trigger: Auto-generate order number
# DELIMITER //
#
# CREATE TRIGGER before_order_insert
#     BEFORE INSERT
#     ON orders
#     FOR EACH ROW
# BEGIN
#     IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
#         SET NEW.order_number = CONCAT(
#                 'ORD-',
#                 YEAR(NOW()),
#                 '-',
#                 LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, -5) AS UNSIGNED)), 0) + 1
#                       FROM orders
#                       WHERE order_number LIKE CONCAT('ORD-', YEAR(NOW()), '-%')), 5, '0')
#                                );
#     END IF;
# END//
#
# DELIMITER ;
#
# -- Trigger: Update customer total_spent after order
# DELIMITER //
#
# CREATE TRIGGER after_order_confirm
#     AFTER UPDATE
#     ON orders
#     FOR EACH ROW
# BEGIN
#     IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
#         UPDATE customer_profiles
#         SET total_spent = total_spent + NEW.total
#         WHERE user_id = NEW.user_id;
#     END IF;
# END//
#
# DELIMITER ;
#
# -- Trigger: Decrement product stock after order confirmation
# DELIMITER //

# CREATE TRIGGER after_order_item_insert
#     AFTER INSERT
#     ON order_items
#     FOR EACH ROW
# BEGIN
#     DECLARE order_status VARCHAR(20);
#
#     SELECT status INTO order_status FROM orders WHERE id = NEW.order_id;
#
#     IF order_status IN ('confirmed', 'processing', 'shipped') THEN
#         UPDATE products
#         SET stock_quantity = stock_quantity - NEW.quantity,
#             order_count    = order_count + 1
#         WHERE id = NEW.product_id
#           AND track_inventory = TRUE;
#     END IF;
# END//
#
# DELIMITER ;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries

-- Find active products in a shop with stock
CREATE INDEX idx_product_shop_active_stock ON products (shop_id, is_active, stock_quantity);

-- Find user's recent orders
CREATE INDEX idx_order_user_created ON orders (user_id, created_at DESC);

-- Cart cleanup query optimization
CREATE INDEX idx_cart_expires_status ON carts (expires_at, status);

-- Product search by shop and category
CREATE INDEX idx_product_search ON products (shop_id, is_active, created_at DESC);

CREATE INDEX idx_orders_shipping_address ON orders(shipping_address_id);
CREATE INDEX idx_orders_billing_address ON orders(billing_address_id);
CREATE INDEX idx_customer_profile_default_shipping ON customer_profiles(default_shipping_address_id);
CREATE INDEX idx_customer_profile_default_billing ON customer_profiles(default_billing_address_id);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active products with stock view
# CREATE VIEW active_products_with_stock AS
# SELECT p.*,
#        s.name                                                                                 AS shop_name,
#        s.slug                                                                                 AS shop_slug,
#        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS primary_image_url,
#        (SELECT COUNT(*) FROM product_images WHERE product_id = p.id)                          AS image_count
# FROM products p
#          JOIN shops s ON p.shop_id = s.id
# WHERE p.is_active = TRUE
#   AND s.is_active = TRUE
#   AND (p.track_inventory = FALSE OR p.stock_quantity > 0);
#
# -- User order summary view
# CREATE VIEW user_order_summary AS
# SELECT u.id                                                                          AS user_id,
#        u.email,
#        u.first_name,
#        u.last_name,
#        COUNT(o.id)                                                                   AS total_orders,
#        COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total ELSE 0 END), 0)    AS total_spent,
#        COALESCE(AVG(CASE WHEN o.status = 'delivered' THEN o.total ELSE NULL END), 0) AS average_order_value,
#        MAX(o.created_at)                                                             AS last_order_date
# FROM users u
#          LEFT JOIN orders o ON u.id = o.user_id
# GROUP BY u.id, u.email, u.first_name, u.last_name;

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================

-- Insert a default admin user (update with real Supertokens ID after signup)
-- This is just a placeholder
INSERT INTO users (id, supertokens_user_id, email, email_verified, first_name, last_name, role, is_active)
VALUES (UUID(),
        'PLACEHOLDER_SUPERTOKENS_ID',
        'admin@onlineshop.com',
        TRUE,
        'Admin',
        'User',
        'owner',
        TRUE);

-- Insert some default categories
INSERT INTO categories (id, parent_id, name, slug, description, display_order, is_active)
VALUES (UUID(), NULL, 'Electronics', 'electronics', 'Electronic devices and accessories', 1, TRUE),
       (UUID(), NULL, 'Clothing', 'clothing', 'Fashion and apparel', 2, TRUE),
       (UUID(), NULL, 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', 3, TRUE),
       (UUID(), NULL, 'Sports', 'sports', 'Sports equipment and accessories', 4, TRUE),
       (UUID(), NULL, 'Books', 'books', 'Books and magazines', 5, TRUE);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'Database schema created successfully!'                                             AS message,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'palyground') AS total_tables,
       (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'palyground')  AS total_views;