# Product Reviews App - Architecture & Design

## 1. ARCHITECTURE OVERVIEW

### High-Level Design

```
┌─────────────────────────────────────────────┐
│         Angular 18+ Frontend                 │
│  (Feature-based, Material Design, RxJS)      │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
                  │
┌─────────────────▼───────────────────────────┐
│    NestJS Backend API                        │
│  (Controllers → Services → Repositories)     │
│  (JWT Auth, Guards, Interceptors)            │
└─────────────────┬───────────────────────────┘
                  │ SQL
┌─────────────────▼───────────────────────────┐
│    Prisma ORM                                │
│  (Query Builder, Migrations, Seeding)        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│    PostgreSQL Database                       │
│  (Single DB - users, products, reviews)      │
└─────────────────────────────────────────────┘
```

### Technology Choices

**Frontend**
- Angular 18+ (latest stable, opinionated framework)
- Angular Material (pre-built Material Design components)
- RxJS (reactive state management)
- TypeScript (strict mode)
- Standalone components (modern Angular)

**Backend**
- NestJS (Node.js framework with SOLID principles)
- TypeScript (strict typing)
- Passport.js + JWT (authentication)
- Prisma (type-safe ORM)
- Class-validator + class-transformer (DTO validation)

**Database**
- PostgreSQL (single database, relational, reliable)
- Prisma (excellent type safety, migrations, seeding)

**Monorepo**
- Nx (better than pnpm workspaces for NestJS + Angular)
- Managed dependencies, shared types, generators

---

## 2. FOLDER STRUCTURE

```
product-reviews-app/
├── nx.json                       # Nx workspace config
├── package.json
├── pnpm-workspace.yaml          # pnpm workspaces config
├── docker-compose.yml
├── .env.example
├── .nxrc.json
├── turbo.json (optional)
│
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── features/                 # Feature modules (auth, products, reviews, users)
│   │   │   ├── common/                   # Guards, decorators, filters, exceptions
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   ├── config/
│   │   │   │   └── auth/
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── dto/                   # Request/Response DTOs
│   │   │   │   ├── utils/
│   │   │   │   └── constants/
│   │   │   │
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma               # Database schema
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   ├── test/
│   │   │   ├── unit/                      # Service tests
│   │   │   └── integration/               # API tests
│   │   │
│   │   ├── .env.local
│   │   ├── jest.config.ts
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/
│       │   │   │   ├── auth/              # Auth service, guards
│       │   │   │   ├── interceptors/
│       │   │   │   ├── guards/
│       │   │   │   ├── services/
│       │   │   │   └── models/
│       │   │   │
│       │   │   ├── features/
│       │   │   │   ├── auth/
│       │   │   │   │   ├── pages/
│       │   │   │   │   ├── components/
│       │   │   │   │   ├── services/
│       │   │   │   │   └── auth.module.ts
│       │   │   │   │
│       │   │   │   ├── products/
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   ├── product-catalog/
│       │   │   │   │   │   └── product-detail/
│       │   │   │   │   ├── components/
│       │   │   │   │   ├── services/
│       │   │   │   │   ├── models/
│       │   │   │   │   └── products.module.ts
│       │   │   │   │
│       │   │   │   ├── account/
│       │   │   │   │   ├── pages/
│       │   │   │   │   ├── components/
│       │   │   │   │   ├── services/
│       │   │   │   │   └── account.module.ts
│       │   │   │   │
│       │   │   │   └── reviews/
│       │   │   │       ├── components/
│       │   │   │       ├── services/
│       │   │   │       └── models/
│       │   │   │
│       │   │   ├── shared/
│       │   │   │   ├── components/        # Reusable UI
│       │   │   │   ├── pipes/
│       │   │   │   ├── directives/
│       │   │   │   ├── utils/
│       │   │   │   └── shared.module.ts
│       │   │   │
│       │   │   ├── app.routes.ts
│       │   │   └── app.component.ts
│       │   │
│       │   ├── assets/                    # (optional) static assets (not currently used)
│       │   ├── favicon.ico / favicon.png
│       │   ├── styles.scss                # Global styles
│       │   └── main.ts                    # Bootstrap
│       │
│       ├── test/
│       │   ├── unit/
│       │   └── e2e/
│       │
│       ├── karma.conf.js
│       ├── jest.config.ts
│       ├── angular.json
│       └── package.json
│
├── packages/
│   └── shared-types/                    # TypeScript interfaces
│       ├── src/
│       │   ├── api/
│       │   ├── models/
│       │   └── index.ts
│       └── package.json
│
├── scripts/                             # Utility scripts
│   ├── seed-db.ts
│   └── docker-setup.sh
│
├── .github/
│   └── workflows/                       # CI (tests + e2e on push)
│
├── docs/                                # Additional docs
│   ├── PRODUCT_REVIEWS_BACKEND.md
│   ├── REVIEW_SYSTEM_ARCH_ANALYSIS.md
│   ├── FRONTEND_ARCHITECTURE_ANALYSIS.md
│   └── REVIEW_SYSTEM_DESIGN_DECISIONS_B1.md
│
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

---

## 3. DATA MODEL

### Database Schema

```sql
-- Users table
User
  id: UUID (primary key)
  email: String (unique)
  passwordHash: String
  displayName: String
  avatarUrl: String (nullable)
  role: Enum (USER, ADMIN) -- default: USER (admin flow not used)
  createdAt: DateTime
  updatedAt: DateTime

-- Products table  
Product
  id: UUID (primary key)
  slug: String (unique, lowercase)
  name: String
  description: String
  price: Decimal
  imageUrl: String
  category: String
  averageRating: Float (nullable, computed)
  reviewCount: Int (default: 0)
  ratingSum: Int (default: 0) -- denormalized sum of ratings (incremental updates)
  createdAt: DateTime
  updatedAt: DateTime

-- Reviews table
Review
  id: UUID (primary key)
  userId: UUID (FK → User.id)
  productId: UUID (FK → Product.id)
  rating: Int (1-5, constraint CHECK)
  comment: String (nullable)
  createdAt: DateTime
  updatedAt: DateTime
  
  UNIQUE(userId, productId) -- one review per user per product
```

### Design Notes

**Why averageRating & reviewCount in Product table?**
- Query optimization: prevents N+1 queries when listing products
- Pre-computed via database triggers or application-level updates
- Updates via separate service method
- Trade-off: denormalization for read performance

**Why UUID instead of auto-increment?**
- Better security (predictability)
- Easier for distributed systems (future)
- Standard practice

---

## 4. API DESIGN

### Authentication Endpoints

```
POST   /api/v1/auth/register
  body: { email, password, displayName }
  → { message }

POST   /api/v1/auth/login
  body: { email, password }
  → { accessToken }

GET    /api/v1/auth/me
  headers: { Authorization: Bearer <token> }
  → { id, email, displayName, avatarUrl, role }
```

### User Endpoints

```
GET    /api/v1/users/me
  → current user profile

PATCH  /api/v1/users/me
  body: { displayName?, avatarUrl?, email? }
  → updated user
```

### Products Endpoints

```
GET    /api/v1/products?page=1&limit=12&search=phone&category=electronics
  → { data: Product[], total, page, limit }

GET    /api/v1/products/:id
  → Product
```

### Reviews Endpoints

```
GET    /api/v1/products/:productId/reviews?page=1&limit=10
  → { data: Review[], total, page, limit }

POST   /api/v1/products/:productId/reviews
  body: { rating: 1-5, comment }
  → Review (creates or replaces existing)

PATCH  /api/v1/reviews/:id
  body: { rating?, comment? }
  → updated Review

DELETE /api/v1/reviews/:id
  → { statusCode: 204 }
```

### Error Responses

```
400 Bad Request
{
  statusCode: 400,
  message: "Validation failed",
  errors: { field: "error message" }
}

401 Unauthorized
{
  statusCode: 401,
  message: "Invalid credentials"
}

403 Forbidden
{
  statusCode: 403,
  message: "Insufficient permissions"
}

404 Not Found
{
  statusCode: 404,
  message: "Resource not found"
}

409 Conflict
{
  statusCode: 409,
  message: "Email already exists"
}
```

---

## 5. Authentication & Authorization

### JWT Strategy

- **Access Token**: Short-lived (15 min), contains: `sub` (userId), `email`, `role`
- **Bearer scheme**: `Authorization: Bearer <accessToken>`

### Guards & Decorators

```typescript
// Route-level
@UseGuards(JwtAuthGuard)
@Get('me')
getProfile() { }

// Optional custom decorators
@CurrentUser() user: User
@IsOwner() - for reviews
@HasRole('admin')
```

### Roles

- `USER`: Can read products, write/edit/delete own reviews, edit own profile

---

## 6. KEY DESIGN DECISIONS

### 1. **Layered Architecture**
- **Controllers** (thin): HTTP parsing, validation, error handling
- **Services** (thick): Business logic, data orchestration
- **Repositories** (Prisma): Data access layer
- **Entities**: Domain models

**Why**: Testability, separation of concerns, reusability

### 2. **DTOs for API Boundaries**
- Separate input (CreateReviewDTO) and output (ReviewResponseDTO)
- Validation at controller layer via class-validator
- Prevents accidental field exposure

### 3. **Prisma Repositories Pattern**
- Wrapper around Prisma for loose coupling
- Easier to test and mock
- Custom queries encapsulated

### 4. **Feature-based Frontend Structure**
- Each feature (auth, products, account) is self-contained
- Clear module boundaries
- Importable services and guards

### 5. **No Microservices**
- Single NestJS backend, single PostgreSQL database
- Simpler deployment, easier debugging
- Monolithic architecture is appropriate for interview scope

### 6. **One Review Per User Per Product**
- Enforced by database UNIQUE constraint
- Upsert pattern: POST creates or replaces review
- Simplifies UX (no "edit review" vs "add review" decision)

### 7. **Denormalized Ratings in Product**
- Pre-computed averageRating and reviewCount
- Updated via trigger or application logic
- Justification: Interview scope, simple scaling strategy

---

## 7. TESTING STRATEGY

### Backend

**Unit Tests** (Jest)
- Services: business logic in isolation
- DTOs: validation rules
- Coverage: 70-80%

**Integration Tests** (Jest + Supertest)
- Auth (register, login, JWT flow)
- Products (CRUD, pagination)
- Reviews (unique constraint, upsert)
- Error cases (validation, 401, 403, 404)

### Frontend

**Component Tests** (Jasmine/Karma or Jest)
- Material form components
- Review list component
- Product card component

**Service Tests** (Jest)
- AuthService (login, token storage)
- ProductService (API calls)
- ReviewService (CRUD)

### E2E Tests (Playwright)

Critical user journeys:
1. Register → Login → View products
2. Click product → View reviews → Add review
3. Edit own review → Delete review
4. Go to /account → Update profile
5. Logout

---

## 8. DEVELOPMENT EXPERIENCE

### Scripts (package.json)

```json
"scripts": {
  "start": "docker-compose up -d && pnpm dev",
  "dev": "pnpm --filter=backend dev & pnpm --filter=frontend dev",
  "test": "pnpm --filter=backend test & pnpm --filter=frontend test",
  "e2e": "pnpm --filter=frontend e2e",
  "db:migrate": "pnpm --filter=backend prisma migrate dev",
  "db:seed": "pnpm --filter=backend prisma db seed"
}
```

### Docker Setup

- PostgreSQL 15 in container
- Volume for data persistence
- Simple docker-compose.yml
- Environment variables in .env

### Getting Started (3 steps)

```bash
# 1. Install & setup
pnpm install
cp .env.example .env

# 2. Database
pnpm db:migrate
pnpm db:seed

# 3. Run
pnpm dev
```

---

## 9. DEPLOYMENT CONSIDERATIONS

**For future (not in scope)**
- Docker image for backend (multi-stage build)
- Frontend build to static assets
- Nginx or Cloud CDN
- CI/CD: GitHub Actions or similar

---

## 10. TRADE-OFFS & DECISIONS

| Decision | Trade-off | Justification |
|----------|-----------|---------------|
| Single DB | Limited sharding flexibility | Simplicity, interview scope |
| Denormalized ratings | Update complexity | Performance for product listing |
| No refresh tokens | Less security | Simpler demo auth flow (access token only) |
| Nx over pnpm | Larger setup | Better tooling, generators |
| Material Design | Less custom | Fast, professional, accessible |
| One review per user | Limited flexibility | Simplifies UX and rules |

---

## 11. FUTURE IMPROVEMENTS

**See README.md section: Future Improvements**

High-impact next steps:
1. Email verification (nodemailer)
2. Password reset flow
3. Caching (Redis) for products
4. Image upload (S3 + signed URLs)
5. Rate limiting (express-rate-limit)
6. Audit logs
7. Search optimization (full-text, Elasticsearch)
8. Async processing (Bull queues for emails)
9. Observability (Winston logs, OpenTelemetry)
10. CI/CD pipelines
---

## NEXT: Implementation Plan

1. **Setup Nx monorepo** with NestJS + Angular templates
2. **Database schema** + Prisma migrations
3. **Backend**: Auth → Products → Reviews
4. **Frontend**: Login → Catalog → Product detail → Account
5. **Testing**: Unit + Integration + E2E
6. **Documentation**: README, API docs, architecture notes
7. **Docker**: Compose file, seed script
