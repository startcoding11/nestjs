#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up NestJS E-commerce Project Structure...${NC}\n"

# Create directory function
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo -e "${GREEN}Created:${NC} $1"
    else
        echo -e "${YELLOW}Exists:${NC} $1"
    fi
}

# Create file function
create_file() {
    if [ ! -f "$1" ]; then
        touch "$1"
        echo -e "${GREEN}Created:${NC} $1"
    else
        echo -e "${YELLOW}Exists:${NC} $1"
    fi
}

# Create TypeScript file with basic content
create_ts_file() {
    if [ ! -f "$1" ]; then
        cat > "$1" << 'EOF'
// ${2}
EOF
        echo -e "${GREEN}Created:${NC} $1"
    else
        echo -e "${YELLOW}Exists:${NC} $1"
    fi
}

# Start from project root (adjust if needed)
PROJECT_ROOT="."
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Creating API Layer${NC}"
# API Layer
create_dir "$PROJECT_ROOT/src/api"
create_dir "$PROJECT_ROOT/src/api/auth"
create_dir "$PROJECT_ROOT/src/api/auth/controllers"
create_dir "$PROJECT_ROOT/src/api/auth/dto"
create_dir "$PROJECT_ROOT/src/api/auth/services"
create_dir "$PROJECT_ROOT/src/api/auth/interfaces"

# Auth files
create_ts_file "$PROJECT_ROOT/src/api/auth/controllers/auth.controller.ts" "Authentication Controller"
create_ts_file "$PROJECT_ROOT/src/api/auth/controllers/session.controller.ts" "Session Controller"
create_ts_file "$PROJECT_ROOT/src/api/auth/dto/login.dto.ts" "Login DTO"
create_ts_file "$PROJECT_ROOT/src/api/auth/dto/register.dto.ts" "Register DTO"
create_ts_file "$PROJECT_ROOT/src/api/auth/dto/refresh-token.dto.ts" "Refresh Token DTO"
create_ts_file "$PROJECT_ROOT/src/api/auth/services/auth.service.ts" "Auth Service"
create_ts_file "$PROJECT_ROOT/src/api/auth/interfaces/auth.interface.ts" "Auth Interfaces"
create_ts_file "$PROJECT_ROOT/src/api/auth/auth.module.ts" "Auth Module"

# Users API
create_dir "$PROJECT_ROOT/src/api/users"
create_dir "$PROJECT_ROOT/src/api/users/controllers"
create_dir "$PROJECT_ROOT/src/api/users/dto"
create_dir "$PROJECT_ROOT/src/api/users/services"

create_ts_file "$PROJECT_ROOT/src/api/users/controllers/users.controller.ts" "Users Controller"
create_ts_file "$PROJECT_ROOT/src/api/users/dto/create-user.dto.ts" "Create User DTO"
create_ts_file "$PROJECT_ROOT/src/api/users/dto/update-profile.dto.ts" "Update Profile DTO"
create_ts_file "$PROJECT_ROOT/src/api/users/dto/change-role.dto.ts" "Change Role DTO"
create_ts_file "$PROJECT_ROOT/src/api/users/services/users.service.ts" "Users Service"
create_ts_file "$PROJECT_ROOT/src/api/users/users.module.ts" "Users Module"

# Shops API
create_dir "$PROJECT_ROOT/src/api/shops"
create_dir "$PROJECT_ROOT/src/api/shops/controllers"
create_dir "$PROJECT_ROOT/src/api/shops/dto"
create_dir "$PROJECT_ROOT/src/api/shops/services"

create_ts_file "$PROJECT_ROOT/src/api/shops/controllers/shops.controller.ts" "Shops Controller"
create_ts_file "$PROJECT_ROOT/src/api/shops/dto/create-shop.dto.ts" "Create Shop DTO"
create_ts_file "$PROJECT_ROOT/src/api/shops/dto/update-shop.dto.ts" "Update Shop DTO"
create_ts_file "$PROJECT_ROOT/src/api/shops/dto/assign-worker.dto.ts" "Assign Worker DTO"
create_ts_file "$PROJECT_ROOT/src/api/shops/services/shops.service.ts" "Shops Service"
create_ts_file "$PROJECT_ROOT/src/api/shops/shops.module.ts" "Shops Module"

# API Module
create_ts_file "$PROJECT_ROOT/src/api/api.module.ts" "API Module"

echo -e "\n${YELLOW}Step 2: Creating Core Layer${NC}"
# Core Layer
create_dir "$PROJECT_ROOT/src/core"
create_dir "$PROJECT_ROOT/src/core/auth"
create_dir "$PROJECT_ROOT/src/core/auth/guards"
create_dir "$PROJECT_ROOT/src/core/auth/strategies"
create_dir "$PROJECT_ROOT/src/core/auth/services"
create_dir "$PROJECT_ROOT/src/core/auth/middleware"

# Core Auth files
create_ts_file "$PROJECT_ROOT/src/core/auth/guards/auth.guard.ts" "Auth Guard"
create_ts_file "$PROJECT_ROOT/src/core/auth/guards/roles.guard.ts" "Roles Guard"
create_ts_file "$PROJECT_ROOT/src/core/auth/guards/shop-access.guard.ts" "Shop Access Guard"
create_ts_file "$PROJECT_ROOT/src/core/auth/strategies/supertokens.strategy.ts" "Supertokens Strategy"
create_ts_file "$PROJECT_ROOT/src/core/auth/services/supertokens.service.ts" "Supertokens Service"
create_ts_file "$PROJECT_ROOT/src/core/auth/services/session.service.ts" "Session Service"
create_ts_file "$PROJECT_ROOT/src/core/auth/middleware/supertokens.middleware.ts" "Supertokens Middleware"
create_ts_file "$PROJECT_ROOT/src/core/auth/auth.core.module.ts" "Auth Core Module"

# Database (keep existing if present)
if [ ! -d "$PROJECT_ROOT/src/core/database" ]; then
    create_dir "$PROJECT_ROOT/src/core/database"
    create_dir "$PROJECT_ROOT/src/core/database/migrations"
    create_dir "$PROJECT_ROOT/src/core/database/seeds"
    create_ts_file "$PROJECT_ROOT/src/core/database/datasource.ts" "TypeORM DataSource"
    create_ts_file "$PROJECT_ROOT/src/core/database/database.module.ts" "Database Module"
fi

# Exceptions
create_dir "$PROJECT_ROOT/src/core/exceptions"
create_dir "$PROJECT_ROOT/src/core/exceptions/filters"
create_ts_file "$PROJECT_ROOT/src/core/exceptions/filters/http-exception.filter.ts" "HTTP Exception Filter"
create_ts_file "$PROJECT_ROOT/src/core/exceptions/filters/validation-exception.filter.ts" "Validation Exception Filter"
create_ts_file "$PROJECT_ROOT/src/core/exceptions/filters/query-failed.filter.ts" "Query Failed Filter"
create_ts_file "$PROJECT_ROOT/src/core/exceptions/exceptions.module.ts" "Exceptions Module"

create_ts_file "$PROJECT_ROOT/src/core/core.module.ts" "Core Module"

echo -e "\n${YELLOW}Step 3: Creating Domain Layer${NC}"
# Domain Layer
create_dir "$PROJECT_ROOT/src/domain"
create_dir "$PROJECT_ROOT/src/domain/user"
create_dir "$PROJECT_ROOT/src/domain/user/entities"
create_dir "$PROJECT_ROOT/src/domain/user/repositories"
create_dir "$PROJECT_ROOT/src/domain/user/services"

# User Domain files
create_ts_file "$PROJECT_ROOT/src/domain/user/entities/user.entity.ts" "User Entity"
create_ts_file "$PROJECT_ROOT/src/domain/user/entities/customer-profile.entity.ts" "Customer Profile Entity"
create_ts_file "$PROJECT_ROOT/src/domain/user/entities/worker-profile.entity.ts" "Worker Profile Entity"
create_ts_file "$PROJECT_ROOT/src/domain/user/repositories/user.repository.ts" "User Repository"
create_ts_file "$PROJECT_ROOT/src/domain/user/services/user.domain.service.ts" "User Domain Service"
create_ts_file "$PROJECT_ROOT/src/domain/user/user.domain.module.ts" "User Domain Module"

# Shop Domain
create_dir "$PROJECT_ROOT/src/domain/shop"
create_dir "$PROJECT_ROOT/src/domain/shop/entities"
create_dir "$PROJECT_ROOT/src/domain/shop/repositories"
create_ts_file "$PROJECT_ROOT/src/domain/shop/entities/shop.entity.ts" "Shop Entity"
create_ts_file "$PROJECT_ROOT/src/domain/shop/entities/shop-worker.entity.ts" "Shop Worker Entity"
create_ts_file "$PROJECT_ROOT/src/domain/shop/repositories/shop.repository.ts" "Shop Repository"
create_ts_file "$PROJECT_ROOT/src/domain/shop/shop.domain.module.ts" "Shop Domain Module"

create_ts_file "$PROJECT_ROOT/src/domain/domain.module.ts" "Domain Module"

echo -e "\n${YELLOW}Step 4: Creating Shared Layer${NC}"
# Shared Layer
create_dir "$PROJECT_ROOT/src/shared"
create_dir "$PROJECT_ROOT/src/shared/constants"
create_dir "$PROJECT_ROOT/src/shared/decorators"
create_dir "$PROJECT_ROOT/src/shared/enums"
create_dir "$PROJECT_ROOT/src/shared/interfaces"
create_dir "$PROJECT_ROOT/src/shared/types"
create_dir "$PROJECT_ROOT/src/shared/utils"

# Shared files
create_ts_file "$PROJECT_ROOT/src/shared/constants/app.constants.ts" "Application Constants"
create_ts_file "$PROJECT_ROOT/src/shared/constants/error.constants.ts" "Error Constants"
create_ts_file "$PROJECT_ROOT/src/shared/constants/role.constants.ts" "Role Constants"

create_ts_file "$PROJECT_ROOT/src/shared/decorators/public.decorator.ts" "Public Decorator"
create_ts_file "$PROJECT_ROOT/src/shared/decorators/roles.decorator.ts" "Roles Decorator"
create_ts_file "$PROJECT_ROOT/src/shared/decorators/current-user.decorator.ts" "Current User Decorator"
create_ts_file "$PROJECT_ROOT/src/shared/decorators/permissions.decorator.ts" "Permissions Decorator"

create_ts_file "$PROJECT_ROOT/src/shared/enums/user-role.enum.ts" "User Role Enum"
create_ts_file "$PROJECT_ROOT/src/shared/enums/order-status.enum.ts" "Order Status Enum"
create_ts_file "$PROJECT_ROOT/src/shared/enums/shop-status.enum.ts" "Shop Status Enum"

create_ts_file "$PROJECT_ROOT/src/shared/interfaces/user.interface.ts" "User Interface"
create_ts_file "$PROJECT_ROOT/src/shared/interfaces/shop.interface.ts" "Shop Interface"
create_ts_file "$PROJECT_ROOT/src/shared/interfaces/api-response.interface.ts" "API Response Interface"

create_ts_file "$PROJECT_ROOT/src/shared/types/user.types.ts" "User Types"
create_ts_file "$PROJECT_ROOT/src/shared/types/shop.types.ts" "Shop Types"
create_ts_file "$PROJECT_ROOT/src/shared/types/pagination.types.ts" "Pagination Types"

create_ts_file "$PROJECT_ROOT/src/shared/utils/pagination.utils.ts" "Pagination Utilities"
create_ts_file "$PROJECT_ROOT/src/shared/utils/password.utils.ts" "Password Utilities"
create_ts_file "$PROJECT_ROOT/src/shared/utils/validation.utils.ts" "Validation Utilities"
create_ts_file "$PROJECT_ROOT/src/shared/utils/shop.utils.ts" "Shop Utilities"

create_ts_file "$PROJECT_ROOT/src/shared/shared.module.ts" "Shared Module"

echo -e "\n${YELLOW}Step 5: Creating Config Layer${NC}"
# Config Layer
create_dir "$PROJECT_ROOT/src/config"
create_ts_file "$PROJECT_ROOT/src/config/app.config.ts" "App Configuration"
create_ts_file "$PROJECT_ROOT/src/config/database.config.ts" "Database Configuration"
create_ts_file "$PROJECT_ROOT/src/config/supertokens.config.ts" "Supertokens Configuration"
create_ts_file "$PROJECT_ROOT/src/config/redis.config.ts" "Redis Configuration"
create_ts_file "$PROJECT_ROOT/src/config/config.module.ts" "Config Module"

echo -e "\n${YELLOW}Step 6: Creating Swagger${NC}"
# Swagger
create_dir "$PROJECT_ROOT/src/swagger"
create_ts_file "$PROJECT_ROOT/src/swagger/swagger.config.ts" "Swagger Configuration"
create_ts_file "$PROJECT_ROOT/src/swagger/swagger.module.ts" "Swagger Module"

echo -e "\n${YELLOW}Step 7: Root Files${NC}"
# Root files (only create if they don't exist)
if [ ! -f "$PROJECT_ROOT/src/app.module.ts" ]; then
    create_ts_file "$PROJECT_ROOT/src/app.module.ts" "Root Application Module"
fi
if [ ! -f "$PROJECT_ROOT/src/app.controller.ts" ]; then
    create_ts_file "$PROJECT_ROOT/src/app.controller.ts" "Main Controller"
fi
if [ ! -f "$PROJECT_ROOT/src/main.ts" ]; then
    create_ts_file "$PROJECT_ROOT/src/main.ts" "Application Entry Point"
fi

echo -e "\n${GREEN}✅ Project structure created successfully!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Review the created structure"
echo "2. Update your tsconfig.json paths if needed"
echo "3. Run 'npm install' if you added new dependencies"
echo "4. Start implementing the actual code in each file"