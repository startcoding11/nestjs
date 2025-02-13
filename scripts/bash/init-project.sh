#!/bin/bash

# Define the project root directory
# PROJECT_ROOT="project-root"
PROJECT_ROOT="."

# Create the project root directory
mkdir -p "$PROJECT_ROOT/src"

#!/bin/bash

# Create the project root directory
mkdir -p src

# Create the api directory structure
mkdir -p src/api/core/logger
touch src/api/core/logger/logger.service.ts
mkdir -p src/api/core/exceptions
touch src/api/core/exceptions/exceptions.filter.ts
mkdir -p src/api/core/database
touch src/api/core/database/database.module.ts
mkdir -p src/api/core/auth
touch src/api/core/auth/auth.service.ts
touch src/api/core/index.ts

# Create the v1 directory structure
mkdir -p src/api/v1/entities
touch src/api/v1/entities/users.entity.ts
touch src/api/v1/entities/notes.entity.ts
mkdir -p src/api/v1/dtos
touch src/api/v1/dtos/users.dto.ts
touch src/api/v1/dtos/notes.dto.ts
mkdir -p src/api/v1/services
touch src/api/v1/services/users.service.ts
touch src/api/v1/services/notes.service.ts
mkdir -p src/api/v1/repositories
touch src/api/v1/repositories/users.repository.ts
touch src/api/v1/repositories/notes.repository.ts
mkdir -p src/api/v1/controllers
touch src/api/v1/controllers/users.controller.ts
touch src/api/v1/controllers/notes.controller.ts
touch src/api/v1/index.ts

# Create the modules directory structure
mkdir -p src/api/modules/v1/users
touch src/api/modules/v1/users/user.module.ts
mkdir -p src/api/modules/v1/notes
touch src/api/modules/v1/notes/notes.module.ts
touch src/api/modules/v1/index.ts
touch src/api/modules/index.ts
touch src/api/index.ts

# Create the shared directory structure
mkdir -p src/shared/interfaces
touch src/shared/interfaces/index.ts
mkdir -p src/shared/utils
touch src/shared/utils/index.ts
mkdir -p src/shared/types
touch src/shared/types/index.ts
mkdir -p src/shared/constants
touch src/shared/constants/index.ts
mkdir -p src/shared/decorators
touch src/shared/decorators/index.ts
touch src/shared/index.ts

# Create the config directory structure
mkdir -p src/config
touch src/config/index.ts

echo "Project structure initialized successfully!"
