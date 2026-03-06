## **AuthModule - Complete Implementation Plan**

### **Overview**
The AuthModule handles user registration, login, session management, and authentication.

---

## **📁 File Structure**

```
src/
├── domain/
│   └── auth/
│       ├── auth.domain.module.ts
│       ├── services/
│       │   └── auth.domain.service.ts
│       └── interfaces/
│           └── auth.interface.ts
│
├── api/
│   └── auth/
│       ├── auth.api.module.ts
│       ├── controllers/
│       │   └── auth.controller.ts
│       └── dto/
│           ├── register.dto.ts
│           ├── login.dto.ts
│           ├── refresh-token.dto.ts
│           └── auth-response.dto.ts
│
├── core/
│   └── auth/
│       ├── guards/ (already have)
│       ├── decorators/ (already have)
│       └── middleware/
│           └── supertokens.middleware.ts
│
└── shared/
    └── constants/
        └── auth.constants.ts (optional)
```

---

## **📝 DTOs (Data Transfer Objects)**

### **1. Register DTO**
- Email validation
- Password strength (min 8 chars, 1 uppercase, 1 number)
- Optional: firstName, lastName, phone
- Optional: role (defaults to CUSTOMER)

### **2. Login DTO**
- Email
- Password

### **3. Refresh Token DTO**
- Refresh token string

### **4. Auth Response DTO**
- User object (id, email, role, etc.)
- Session object (accessToken, refreshToken, expiresIn)

---

## **⚙️ Auth Domain Service**

### **Methods to Implement**

#### **register(registerDto)**
1. Check if user exists in local DB
2. Create user in Supertokens
3. Create local UserEntity
4. Create profile (Customer or Worker based on role)
5. Create session
6. Return auth response

#### **login(loginDto)**
1. Authenticate with Supertokens
2. Fetch local user by Supertokens ID
3. Create session
4. Return auth response

#### **getCurrentUser(supertokensUserId)**
1. Fetch user by Supertokens ID
2. Load profile data (customer/worker)
3. Return user response

#### **logout(sessionHandle)**
1. Revoke session in Supertokens

#### **refreshSession(refreshToken)**
1. Get new access token using refresh token

#### **buildAuthResponse(user, session)**
1. Format user data
2. Combine with session tokens
3. Return standardized response

---

## **🎮 Auth Controller**

### **Endpoints**

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|----------|------|
| POST | `/auth/register` | RegisterDto | AuthResponseDto | Public |
| POST | `/auth/login` | LoginDto | AuthResponseDto | Public |
| POST | `/auth/logout` | - | 200 OK | Protected |
| POST | `/auth/refresh` | RefreshTokenDto | { accessToken, refreshToken } | Public |
| GET | `/auth/me` | - | UserResponseDto | Protected |

---

## **🛡️ Supertokens Middleware**

### **Purpose**
- Extract session from request
- Validate session with Supertokens
- Attach user info to request object
- Handle token refresh

### **What It Does**
1. Intercepts all requests (except public routes)
2. Calls Supertokens `getSession()`
3. Attaches `req.user = { id: userId, ... }`
4. Handles expired tokens (401 responses)

---

## **🔧 Module Setup**

### **AuthDomainModule**
- Imports: `DatabaseModule` (for repositories)
- Providers: `AuthDomainService`
- Exports: `AuthDomainService`

### **AuthApiModule**
- Imports: `AuthDomainModule`
- Controllers: `AuthController`

---

## **📋 Implementation Steps (No Code)**

### **Step 1: Create DTOs**
- Define validation rules
- Add Swagger decorators

### **Step 2: Create AuthDomainService**
- Inject UserRepository, CustomerProfileRepository, WorkerProfileRepository
- Implement register method
- Implement login method
- Implement helper methods

### **Step 3: Create Supertokens Middleware**
- Initialize Supertokens in main.ts
- Create middleware to verify sessions
- Add to CoreModule

### **Step 4: Create AuthController**
- Inject AuthDomainService
- Implement endpoints
- Add Swagger documentation

### **Step 5: Register Modules**
- Add AuthDomainModule to DomainModule
- Add AuthApiModule to ApiModule

### **Step 6: Test Flow**
- Register user
- Login
- Access protected /me endpoint
- Logout
- Refresh token

---

## **✅ Success Criteria**

- [ ] User can register with email/password
- [ ] User receives access + refresh tokens
- [ ] User can login with credentials
- [ ] Protected routes return 401 without token
- [ ] /me endpoint returns user profile
- [ ] Logout invalidates session
- [ ] Refresh token endpoint works
- [ ] Customer/Worker profiles created based on role

---

