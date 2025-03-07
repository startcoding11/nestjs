---

### **1. Database Schema Overview**

| **Table**        | **Description**                                                                 |
|------------------|---------------------------------------------------------------------------------|
| **User**         | Stores user credentials and basic information.                                  |
| **Profile**      | Stores additional user information (e.g., name, address).                       |
| **Group**        | Represents a collection of users (e.g., departments, teams).                    |
| **Role**         | Defines roles (e.g., Admin, Administrator, User).                               |
| **Permission**   | Defines permissions (e.g., Create, Read, Update, Delete).                       |
| **Audit**        | Logs all critical actions (e.g., login attempts, role changes, password resets).|

---

### **2. Detailed Schema**

#### **a. User Table**

Stores user credentials and basic information.

| Column          | Type      | Description                               |
| --------------- | --------- | ----------------------------------------- |
| `id`            | SERIAL    | Internal database ID (auto-increment).    |
| `user_id`       | INTEGER   | Unique 5-6 digit surrogate key (indexed). |
| `email`         | VARCHAR   | User's email (unique).                    |
| `password_hash` | VARCHAR   | Hashed password (using bcrypt/Argon2).    |
| `role_id`       | INTEGER   | Foreign key to the `roles` table.         |
| `group_id`      | INTEGER   | Foreign key to the `groups` table.        |
| `created_at`    | TIMESTAMP | Timestamp when the user was created.      |
| `updated_at`    | TIMESTAMP | Timestamp when the user was updated.      |

#### **b. Profile Table**

Stores additional user information.

| Column       | Type      | Description                                         |
| ------------ | --------- | --------------------------------------------------- |
| `id`         | SERIAL    | Internal database ID (auto-increment).              |
| `user_id`    | INTEGER   | Foreign key to the `users` table (using `user_id`). |
| `first_name` | VARCHAR   | User's first name.                                  |
| `last_name`  | VARCHAR   | User's last name.                                   |
| `phone`      | VARCHAR   | User's phone number.                                |
| `address`    | VARCHAR   | User's address.                                     |
| `created_at` | TIMESTAMP | Timestamp when the profile was created.             |
| `updated_at` | TIMESTAMP | Timestamp when the profile was updated.             |

#### **c. Group Table**

Represents a collection of users (e.g., departments, teams).

| Column        | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| `id`          | SERIAL    | Internal database ID (auto-increment).    |
| `group_id`    | INTEGER   | Unique 5-6 digit surrogate key (indexed). |
| `name`        | VARCHAR   | Name of the group.                        |
| `description` | TEXT      | Description of the group.                 |
| `created_at`  | TIMESTAMP | Timestamp when the group was created.     |
| `updated_at`  | TIMESTAMP | Timestamp when the group was updated.     |

#### **d. Role Table**

Defines roles (e.g., Admin, Administrator, User).

| Column        | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| `id`          | SERIAL    | Internal database ID (auto-increment).    |
| `role_id`     | INTEGER   | Unique 5-6 digit surrogate key (indexed). |
| `name`        | VARCHAR   | Name of the role (e.g., Admin, User).     |
| `description` | TEXT      | Description of the role.                  |
| `created_at`  | TIMESTAMP | Timestamp when the role was created.      |
| `updated_at`  | TIMESTAMP | Timestamp when the role was updated.      |

#### **e. Permission Table**

Defines permissions (e.g., Create, Read, Update, Delete).

| Column          | Type      | Description                                |
| --------------- | --------- | ------------------------------------------ |
| `id`            | SERIAL    | Internal database ID (auto-increment).     |
| `permission_id` | INTEGER   | Unique 5-6 digit surrogate key (indexed).  |
| `name`          | VARCHAR   | Name of the permission (e.g., Read).       |
| `description`   | TEXT      | Description of the permission.             |
| `created_at`    | TIMESTAMP | Timestamp when the permission was created. |
| `updated_at`    | TIMESTAMP | Timestamp when the permission was updated. |

#### **f. RolePermission Table**

Defines the relationship between roles and permissions.

| Column          | Type    | Description                                                     |
| --------------- | ------- | --------------------------------------------------------------- |
| `role_id`       | INTEGER | Foreign key to the `roles` table (using `role_id`).             |
| `permission_id` | INTEGER | Foreign key to the `permissions` table (using `permission_id`). |

#### **g. Audit Table**

Logs all critical actions (e.g., login attempts, role changes, password resets).

| Column      | Type      | Description                                         |
| ----------- | --------- | --------------------------------------------------- |
| `id`        | SERIAL    | Internal database ID (auto-increment).              |
| `user_id`   | INTEGER   | Foreign key to the `users` table (using `user_id`). |
| `action`    | VARCHAR   | Action performed (e.g., login, role change).        |
| `details`   | TEXT      | Additional details about the action.                |
| `timestamp` | TIMESTAMP | Timestamp of the action.                            |

---

### **3. Relationships**

1. **User ↔ Profile**:

   - One-to-one relationship.
   - Each user has one profile.

2. **User ↔ Role**:

   - Many-to-one relationship.
   - Each user has one role, but a role can belong to multiple users.

3. **User ↔ Group**:

   - Many-to-one relationship.
   - Each user belongs to one group, but a group can have multiple users.

4. **Role ↔ Permission**:

   - Many-to-many relationship.
   - Each role can have multiple permissions, and each permission can belong to multiple roles.

5. **Audit ↔ User**:
   - Many-to-one relationship.
   - Each audit log entry is associated with one user, but a user can have multiple audit log entries.

---

### **4. Example Queries**

#### **a. Create a User**

```sql
INSERT INTO users (user_id, email, password_hash, role_id, group_id, created_at, updated_at)
VALUES (12345, 'user@example.com', 'hashed-password', 101, 201, NOW(), NOW());
```

#### **b. Assign Permissions to a Role**

```sql
INSERT INTO role_permissions (role_id, permission_id)
VALUES (101, 301);
```

#### **c. Log an Audit Entry**

```sql
INSERT INTO audit (user_id, action, details, timestamp)
VALUES (12345, 'login', 'User logged in successfully', NOW());
```

#### **d. Get User Details with Role and Permissions**

```sql
SELECT u.email, r.name AS role, p.name AS permission
FROM users u
JOIN roles r ON u.role_id = r.role_id
JOIN role_permissions rp ON r.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.permission_id
WHERE u.user_id = 12345;
```

---

### **4. Base Entity Implementation**

Here’s the implementation of the `Base` entity:

```typescript
// base.entity.ts
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { customAlphabet } from 'nanoid';

const NUMBERS = '0123456789';
const ID_LENGTH = 5;

export default abstract class Base {
  @PrimaryGeneratedColumn()
  id: number; // Internal database ID

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  protected idGenerator(
    alphabet: string = NUMBERS,
    length: number = ID_LENGTH,
  ): string {
    return customAlphabet(alphabet, length)();
  }

  protected abstract generateId(): void;
}
```

---

### **5. Extending the Base Entity**

Each entity (e.g., `User`, `Profile`, `Role`) will extend the `Base` entity and implement the `generateId` method to create a **user-facing surrogate key**.

#### **a. User Entity**

```typescript
// user.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Base from './base.entity';

@Entity()
export default class User extends Base {
  @Column({ unique: true })
  userId: string; // 5-6 digit surrogate key

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Group, (group) => group.users)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  constructor() {
    super();
    this.generateId();
  }

  protected generateId(): void {
    this.userId = this.idGenerator();
  }
}
```

#### **b. Profile Entity**

```typescript
// profile.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base.entity';
import User from './user.entity';

@Entity()
export default class Profile extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  constructor() {
    super();
    this.generateId();
  }

  protected generateId(): void {
    // Profile doesn't need a user-facing surrogate key in this example
  }
}
```

#### **c. Role Entity**

```typescript
// role.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import Base from './base.entity';
import User from './user.entity';

@Entity()
export default class Role extends Base {
  @Column({ unique: true })
  roleId: string; // 5-6 digit surrogate key

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  constructor() {
    super();
    this.generateId();
  }

  protected generateId(): void {
    this.roleId = this.idGenerator();
  }
}
```

#### **d. Group Entity**

```typescript
// group.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import Base from './base.entity';
import User from './user.entity';

@Entity()
export default class Group extends Base {
  @Column({ unique: true })
  groupId: string; // 5-6 digit surrogate key

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.group)
  users: User[];

  constructor() {
    super();
    this.generateId();
  }

  protected generateId(): void {
    this.groupId = this.idGenerator();
  }
}
```

#### **e. Permission Entity**

```typescript
// permission.entity.ts
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import Base from './base.entity';
import Role from './role.entity';

@Entity()
export default class Permission extends Base {
  @Column({ unique: true })
  permissionId: string; // 5-6 digit surrogate key

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable()
  roles: Role[];

  constructor() {
    super();
    this.generateId();
  }

  protected generateId(): void {
    this.permissionId = this.idGenerator();
  }
}
```

#### **f. Audit Entity**

```typescript
// audit.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Base from './base.entity';
import User from './user.entity';

@Entity()
export default class Audit extends Base {
  @ManyToOne(() => User, (user) => user.audits)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  action: string;

  @Column()
  details: string;

  @Column()
  timestamp: Date;

  constructor() {
    super();
    this.generateId();
  }

  protected generateId(): void {
    // Audit doesn't need a user-facing surrogate key in this example
  }
}
```

---

### **6. Relationships**

1. **User ↔ Profile**:

   - One-to-one relationship.
   - Each user has one profile.

2. **User ↔ Role**:

   - Many-to-one relationship.
   - Each user has one role, but a role can belong to multiple users.

3. **User ↔ Group**:

   - Many-to-one relationship.
   - Each user belongs to one group, but a group can have multiple users.

4. **Role ↔ Permission**:

   - Many-to-many relationship.
   - Each role can have multiple permissions, and each permission can belong to multiple roles.

5. **Audit ↔ User**:
   - Many-to-one relationship.
   - Each audit log entry is associated with one user, but a user can have multiple audit log entries.

---

### **7. Summary**

- The `Base` entity encapsulates common fields (`id`, `createdAt`, `updatedAt`) and functionality (`idGenerator`).
- Each entity extends `Base` and implements the `generateId` method to create a **user-facing surrogate key**.
- This approach ensures **clean and reusable code** while maintaining **flexibility** for future changes.
