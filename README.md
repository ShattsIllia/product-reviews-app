# Product Reviews App - Full-Stack Application

[![CI](https://github.com/ShattsIllia/product-reviews-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ShattsIllia/product-reviews-app/actions/workflows/ci.yml)

> A full-stack Product Reviews system built with **Angular 18**, **NestJS**, **PostgreSQL**, and **Prisma**.
>
> I tried to keep it clean and easy to understand, without over engineering.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Development](#development)
8. [Testing](#testing)
9. [Database Setup](#database-setup)
10. [Future Improvements](#future-improvements)
11. [Design Decisions](#design-decisions)
12. [Contributing](#contributing)

---

## 🎯 Project Overview

A Product Reviews application (similar to Amazon/Alza reviews). Users can:

- **Register & Login** with JWT authentication
- **Browse Products** with search, filters, and pagination
- **View & Write Reviews** with ratings (1-5 stars)
- **Manage Profile** with avatar and basic info
- **Delete own reviews** (ownership checks on backend)

### Key Features

✅ Authentication (Register, Login, JWT)  
✅ Product Catalog with Search & Filtering  
✅ Review System (Create, Read, Update, Delete)  
✅ User Profiles with Avatar Support  
✅ Responsive Material Design UI  
✅ Type-Safe Full-Stack (TypeScript)  
✅ Comprehensive Testing (Unit, Integration, E2E)  
✅ Docker Support  
✅ Production-Ready Architecture  

---

## 🛠 Tech Stack

### Frontend
- **Angular 18+** - Modern, opinionated web framework
- **Angular Material** - Pre-built Material Design components
- **TypeScript** - Strict typing
- **RxJS** - Reactive programming
- **Standalone Components** - Modern Angular approach

### Backend
- **NestJS** - SOLID Node.js framework
- **TypeScript** - Type safety across stack
- **Passport.js + JWT** - Authentication
- **Prisma** - Type-safe ORM with migrations
- **class-validator** - DTO validation
- **bcrypt** - Password hashing

### Database
- **PostgreSQL 15** - Reliable, relational database
- **Prisma Client** - Type-safe database queries
- **Database Migrations** - Version-controlled schema

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nx Monorepo** - Managed workspace with shared types
- **pnpm** - Fast, efficient package manager

---

## 🧭 Monorepo Notes (Nx + pnpm)

This repository is a monorepo. I used **Nx** and **pnpm workspaces** because I wanted:

- **One install**: install once, run frontend and backend from one repo.
- **Shared TypeScript types**: the frontend and backend can share DTO/types without copy/paste.
- **Consistent scripts**: same commands on any machine.
- **Clear structure**: `apps/` for applications, `packages/` for shared code.

Main folders:

- **`apps/frontend`**: Angular SPA (UI)
- **`apps/backend`**: NestJS REST API
- **`packages/shared-types`**: shared TypeScript types

### Testing
- **Jest** - Unit & integration tests
- **Supertest** - HTTP endpoint testing
- **Jasmine/Karma** - Angular component testing
- **Playwright** - E2E testing

---

## 🏗 Architecture

###  High-Level Architecture

```
┌─────────────────────────────────┐
│    Angular SPA (Port 4200)      │
│    Single Page Application       │
└──────────────┬──────────────────┘
               │ HTTP REST
               ▼
┌─────────────────────────────────┐
│  NestJS API (Port 3000)         │
│  - Controllers (HTTP Layer)      │
│  - Services (Business Logic)     │
│  - Guards & Decorators           │
│  - Error Handling                │
└──────────────┬──────────────────┘
               │ SQL (Prisma)
               ▼
┌─────────────────────────────────┐
│  PostgreSQL Database            │
│  Single Database (All Entities) │
└─────────────────────────────────┘
```

### Backend Layered Architecture

```
Controllers (HTTP Handlers)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access - Prisma)
    ↓
Database (PostgreSQL)
```

**Benefits:**
- Clear separation of concerns
- Easy to test (mock each layer)
- DRY principle
- Scalable
- Maintainable

### Frontend Feature-Based Structure

```
Features/
  ├── Auth/
  │   ├── pages/
  │   ├── components/
  │   └── services/
  ├── Products/
  │   ├── pages/
  │   ├── components/
  │   └── services/
  ├── Account/
  └── Reviews/
      └── components/
```

Each feature is self-contained and independently testable.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.11+ ([download](https://nodejs.org))
- **pnpm** 8.13+ (or install globally: `npm install -g pnpm`)
- **Docker** & **Docker Compose** ([download](https://www.docker.com/products/docker-desktop))
- **PostgreSQL** 15+ (or use Docker Compose)

### 1. Clone & Install

```bash
# Clone project
git clone https://github.com/ShattsIllia/product-reviews-app.git
cd product-reviews-app

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### 2. Database Setup

```bash
# Start PostgreSQL via Docker Compose
docker-compose up -d

# Run Prisma migrations
pnpm db:migrate

# Seed database with demo data
pnpm db:seed

# Verify data (optional)
pnpm db:studio  # Opens Prisma Studio at http://localhost:5555
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend (NestJS)
cd apps/backend
pnpm dev
# Runs on http://localhost:3000

# Terminal 2: Frontend (Angular)
cd apps/frontend
pnpm dev
# Runs on http://localhost:4200
```

Or start both in parallel:
```bash
pnpm dev  # Runs from monorepo root
```

### 4. Access Application

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api/v1
- **Database Studio:** http://localhost:5555

> Note: the backend sets a global prefix `api/v1`, so all REST routes are under `/api/v1/...`.

### Demo Credentials

```
Admin Account:
  Email: admin@example.com
  Password: admin123

Regular User:
  Email: user1@example.com
  Password: password123
  
Another User:
  Email: user2@example.com
  Password: password123
```

---

## 📁 Project Structure

### Monorepo Layout

```
product-reviews-app/
├── apps/
│   ├── backend/                  # NestJS API
│   │   ├── src/
│   │   │   ├── features/         # Feature modules (auth, products, reviews, users)
│   │   │   ├── common/           # Guards, decorators, filters, exceptions
│   │   │   ├── infrastructure/   # Database, auth, config
│   │   │   └── shared/           # DTOs
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Database schema
│   │   │   ├── migrations/       # Schema versions
│   │   │   └── seed.ts           # Demo data
│   │   ├── test/                 # Tests
│   │   ├── .env.local            # Local config
│   │   └── package.json
│   │
│   └── frontend/                 # Angular SPA
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/         # Singleton services
│       │   │   │   ├── auth/     # Auth logic
│       │   │   │   ├── guards/   # Route guards
│       │   │   │   └── services/ # API clients
│       │   │   ├── features/     # Feature modules
│       │   │   │   ├── auth/
│       │   │   │   ├── products/
│       │   │   │   ├── account/
│       │   │   │   └── reviews/
│       │   │   ├── shared/       # Reusable UI
│       │   │   ├── styles/       # Global styles
│       │   │   └── app.routes.ts # Routing
│       │   ├── environments/     # Config per env
│       │   └── main.ts           # Bootstrap
│       ├── test/                 # Tests
│       └── package.json
│
├── packages/
│   └── shared-types/             # Shared TypeScript interfaces
│       ├── src/
│       │   ├── api/
│       │   ├── models/
│       │   └── index.ts
│       └── package.json
│
├── docker-compose.yml            # PostgreSQL container
├── .env.example                  # Environment template
├── nx.json                       # Nx config
├── pnpm-workspace.yaml           # pnpm workspaces
├── tsconfig.json                 # Root TypeScript config
├── package.json                  # Root package.json
└── README.md                     # This file
```

### Key Files

- **Database Schema:** [apps/backend/prisma/schema.prisma](apps/backend/prisma/schema.prisma)
- **API Routes:** `apps/backend/src/features/**/**.controller.ts`
- **Auth Service:** [apps/backend/src/features/auth/auth.service.ts](apps/backend/src/features/auth/auth.service.ts)
- **Frontend Routes:** [apps/frontend/src/app/app.routes.ts](apps/frontend/src/app/app.routes.ts)

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}

Response:
{
  "message": "Account registered successfully. Please login with your credentials."
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer <accessToken>

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "avatarUrl": "...",
  "role": "USER"
}
```

### Products Endpoints

#### Get Products (Paginated)
```http
GET /api/v1/products?page=1&limit=12&search=iphone&category=Electronics

Response:
{
  "data": [
    {
      "id": "uuid",
      "slug": "iphone-15-pro",
      "name": "iPhone 15 Pro",
      "price": 999.00,
      "imageUrl": "...",
      "category": "Electronics",
      "averageRating": 4.5,
      "reviewCount": 2
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 12
}
```

#### Get Product Details
```http
GET /api/v1/products/:id

Response:
{
  "id": "uuid",
  "slug": "iphone-15-pro",
  "name": "iPhone 15 Pro",
  "description": "...",
  "price": 999.00,
  "imageUrl": "...",
  "category": "Electronics",
  "averageRating": 4.5,
  "reviewCount": 2
}
```

### Reviews Endpoints

#### Get Reviews for Product
```http
GET /api/v1/products/:productId/reviews?page=1&limit=10

Response:
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "rating": 5,
      "comment": "Great product!",
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "displayName": "Jane",
        "avatarUrl": "..."
      }
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

#### Add/Update Review (Upsert)
```http
POST /api/v1/products/:productId/reviews
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product, highly recommend!"
}

Response:
{
  "id": "uuid",
  "userId": "uuid",
  "productId": "uuid",
  "rating": 5,
  "comment": "Excellent product, highly recommend!",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Update Review
```http
PATCH /api/v1/reviews/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}
```

#### Delete Review
```http
DELETE /api/v1/reviews/:id
Authorization: Bearer <accessToken>

Response:
{
  "statusCode": 204
}
```

### Users Endpoints

#### Get My Profile
```http
GET /api/v1/users/me
Authorization: Bearer <accessToken>
```

#### Update My Profile
```http
PATCH /api/v1/users/me
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "displayName": "Jane Smith",
  "avatarUrl": "https://new-avatar-url.com/img.jpg"
}
```

### Error Responses

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

---

## 💻 Development

### Common Commands

```bash
# Install dependencies
pnpm install

# Start both backend & frontend
pnpm dev

# Run tests
pnpm test

# Run E2E tests
pnpm e2e

# Check types
pnpm type-check

# Format code
pnpm format

# Lint code
pnpm lint

# Build for production
pnpm build

# Database commands
pnpm db:migrate      # Apply local migrations (dev)
pnpm db:seed        # Seed with demo data
pnpm db:studio      # Open Prisma Studio
pnpm db:migrate:prod # Apply migrations in production
```

### Backend Development

```bash
cd apps/backend

# Development with auto-reload
pnpm dev

# Create new migration
pnpm prisma:migrate

# Generate Prisma types
pnpm prisma:generate

# Run seed script
pnpm prisma:seed
```

### Frontend Development

```bash
cd apps/frontend

# Development server with reload
pnpm dev

# Run tests
pnpm test

# Build production bundle
pnpm build:prod
```

### Environment Variables

Create `.env` file in root:

```env
# Backend
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/product_reviews_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
FRONTEND_URL=http://localhost:4200
```

Notes:

- **Token storage**: the frontend stores the JWT access token in **localStorage** (simple for a demo). For a real product I would use **httpOnly cookies** + refresh tokens to reduce XSS risk.
- **Secrets**: do not commit real secrets. In production I would use a secret manager.

### Code Style

- **Prettier** for formatting
- **ESLint** for linting
- **TypeScript strict** mode enabled

```bash
# Format all code
pnpm format

# Check formatting
pnpm format:check

# Lint
pnpm lint
```

---

## 🧪 Testing

This project includes comprehensive testing at all levels: unit tests, integration tests, component tests, and E2E tests. All test files include detailed examples and patterns for team reference.

### Test Architecture

```
Unit Tests (Services, Utilities)
    ↓
Integration Tests (Controllers with services)
    ↓
Component Tests (Angular components + services)
    ↓
E2E Tests (Full user workflows)
```

### Backend Tests

#### Setup

```bash
cd apps/backend

# Install dependencies
pnpm install

# Run all tests
pnpm test

# Watch mode (auto-rerun on file changes)
pnpm test:watch

# Coverage report
pnpm test:cov
```

#### Test Files

**Unit Tests (Service Layer)**
- `test/unit/auth.service.spec.ts` - Authentication service tests
  - User registration with duplicate email detection
  - Login with credential validation
  - Password hashing and verification
  - Profile retrieval with error handling

- `test/unit/review.service.spec.ts` - Review service tests
  - Creating reviews with upsert pattern (one per user per product)
  - Updating and deleting reviews with ownership checks
  - Product rating calculation and denormalization
  - Pagination and filtering

**Integration Tests (Controller Layer)**
- `test/integration/auth.controller.integration.spec.ts` - API endpoint tests
  - HTTP status codes (201 for register, 200 for login, 401 for unauthorized)
  - Validation error responses with field-specific messages
  - Error handling and exception filter integration
  - Request/response formatting

#### Example Service Test

```typescript
describe('ReviewService', () => {
  it('should update existing review for same user-product pair', async () => {
    // Arrange: Setup mocks
    jest.spyOn(prismaService.review, 'findUnique')
      .mockResolvedValue(existingReview);

    // Act: Call service method
    const result = await service.createReview(userId, productId, updateDto);

    // Assert: Verify behavior
    expect(result.rating).toBe(4);
    expect(prismaService.review.update).toHaveBeenCalled();
  });

  it('should throw ForbiddenException if user is not owner', async () => {
    // Verify ownership check
    await expect(
      service.updateReview(reviewId, wrongUserId, updateDto)
    ).rejects.toThrow(ForbiddenException);
  });
});
```

#### Test Patterns

- **Arrange-Act-Assert:** Setup → Call → Verify
- **Mock Prisma:** Isolate service logic from database
- **Error Cases:** Test both success and failure paths
- **Ownership Checks:** Verify authorization on sensitive operations

### Frontend Tests

#### Setup

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report with HTML
pnpm test:cov
```

#### Test Files

**Component Tests**
- `test/components/login.component.spec.ts` - Login form test
  - Form validation (email format, required fields)
  - Successful login and navigation
  - Error display and state management
  - Loading states and button disabling
  - Input field validation in UI

**Service Tests**
- `test/services/auth.service.spec.ts` - Auth service test
  - Register and login HTTP calls
  - Token storage in localStorage
  - Current user state management with BehaviorSubjects
  - Logout clearing auth state
  - Error handling and retry logic

#### Example Component Test

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Setup component with mocked services
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    component = TestBed.createComponent(LoginComponent).componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should navigate to products on successful login', (done) => {
    // Setup (AuthService.login returns a UserModel after fetching /users/me)
    authService.login.and.returnValue(of(mockUser));

    // Act
    component.form.patchValue({ email: 'test@example.com', password: 'pwd' });
    component.onSubmit();

    // Assert
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
      done();
    }, 100);
  });

  it('should display validation errors on invalid form', () => {
    component.form.get('email')?.setValue('invalid-email');
    fixture.detectChanges();

    expect(component.form.valid).toBeFalsy();
  });
});
```

#### Test Patterns

- **TestBed:** Setup Angular testing module
- **Jasmine Spies:** Mock services with `jasmine.createSpyObj`
- **Observables:** Test async operations with `fakeAsync` and `tick`
- **User Interaction:** Simulate form input and button clicks
- **DOM Queries:** Test UI rendering with `fixture.nativeElement.querySelector`

### E2E Tests (Playwright)

#### Setup

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
pnpm e2e

# Run with UI (visual test runner)
pnpm e2e:ui

# Debug mode (step through tests)
pnpm e2e:debug

# Run specific test file
pnpm e2e test/e2e/app.e2e.spec.ts

# Run in headed mode (see browser)
pnpm e2e --headed
```

#### Test Scenarios (`test/e2e/app.e2e.spec.ts`)

**Authentication Flow**
- Register new user with valid data
- Login with existing credentials
- Display validation errors on invalid input
- Logout and redirect to login page

**Product Browsing**
- Display product catalog with cards
- Filter products by category
- Search products by name
- Navigate to product detail page

**Review Management**
- Add new review with rating and comment
- Update existing review
- Delete review with confirmation
- Verify product rating updates after review

**User Account**
- Navigate to account profile
- Display current user information
- Update user profile
- Verify profile updates persist

**Error Handling**
- Redirect unauthenticated users to login
- Display validation errors on form submission
- Handle network errors gracefully
- Prevent unauthorized actions

#### Example E2E Test

```typescript
test('should add review to product', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:4200');
  await loginUser(page, testUser);

  // Navigate to product
  await page.click('[data-testid="product-card"]');
  await page.waitForURL(/\/products\/\w+/);

  // Add review
  await page.click('button[aria-label="5 stars"]');
  await page.fill('textarea[formControlName="comment"]', 'Great product!');
  await page.click('button[data-testid="submit-review"]');

  // Verify
  const review = page.locator('[data-testid="review-item"]:has-text("Great product!")');
  await expect(review).toBeVisible();
});
```

#### Test Selectors

- `[data-testid="..."]` - Explicit test identifiers (preferred)
- `input[formControlName="..."]` - Form controls
- `button:has-text("...")` - Buttons by text
- `[aria-label="..."]` - Accessible buttons

### Running All Tests

```bash
# Run entire test suite
pnpm test:all

# Or from monorepo root
pnpm test -- --projects="backend" --projects="frontend"

# With coverage
pnpm test:cov:all
```

### Test Coverage Goals

- **Services:** 80%+ coverage (core business logic)
- **Controllers:** 70%+ coverage (HTTP handling)
- **Components:** 70%+ coverage (UI behavior)
- **E2E:** All critical user journeys covered
  - User registration and login
  - Product browsing and search
  - Review creation, update, deletion
  - Account management

### Debugging Tests

#### Backend
```bash
# Run single test file
pnpm test -- auth.service.spec.ts

# Run tests matching pattern
pnpm test -- --testNamePattern="should register"

# Debug with node inspector
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

#### Frontend
```bash
# Run specific test
pnpm test -- --include='**/login.component.spec.ts'

# Watch mode for development
pnpm test:watch

# Debug in Chrome
ng test --browsers=Chrome --watch
```

#### E2E
```bash
# Step through tests in Playwright Inspector
pnpm e2e:debug

# Run single test
npx playwright test test/e2e/app.e2e.spec.ts -g "should add review"

# Headed mode to see browser
pnpm e2e --headed

# Trace for debugging failures
pnpm e2e --trace on
```

### Adding New Tests

1. **Follow existing patterns** - Use arrange-act-assert structure
2. **Mock external dependencies** - Isolate code under test
3. **Test happy path + edge cases** - Success and error scenarios
4. **Use descriptive names** - `should [expected behavior] when [condition]`
5. **Keep tests focused** - One assertion per test when possible
6. **Add data-testid attributes** - For E2E selectors in components

### CI/CD Integration

Tests run automatically in CI pipeline:
```yaml
# GitHub Actions example
- Run backend tests
- Run frontend tests
- Run E2E tests
- Generate coverage reports
- Fail build if coverage < targets
```

---

## 🗄 Database Setup

### Using Docker Compose

```bash
# Start PostgreSQL
docker-compose up -d

# View logs
docker-compose logs postgres

# Stop container
docker-compose down

# Reset database
docker-compose down -v
```

### Database Schema

See [Prisma Schema](apps/backend/prisma/schema.prisma) for complete schema.

**Core Tables:**
- `users` - User accounts and profiles
- `products` - Product catalog
- `reviews` - User reviews with ratings
- Relationships enforced with foreign keys
- Unique constraint: one review per user per product

### Migrations

```bash
# Create new migration
pnpm db:migrate

# Apply pending migrations
pnpm db:migrate:prod

# Reset database (dev only)
pnpm db:reset

# View data with Studio
pnpm db:studio
```

### Seeding

Pre-populated demo data includes:

- 3 users (2 regular, 1 admin)
- 6 sample products (Electronics, Books, Home)
- 4 sample reviews

Run: `pnpm db:seed`

---

## 🔐 Security Considerations

### Authentication
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens (15 min expiry)
- ✅ Bearer token in Authorization header
- ⚠️ No refresh tokens (future improvement)

### Database
- ✅ Parameterized queries (Prisma prevents SQL injection)
- ✅ Foreign key constraints
- ✅ Unique constraints
- ✅ Type validation

### API
- ✅ DTO validation on all endpoints
- ✅ Ownership checks (users can only edit own reviews)
- ✅ CORS enabled for frontend

### Future
- [ ] Rate limiting
- [ ] Email verification
- [ ] Password reset
- [ ] Refresh tokens
- [ ] Audit logging
- [ ] HTTPS enforcement
- [ ] helmet.js security headers
- [ ] API versioning

---

## 📈 Future Improvements

### High Priority (Recommended)
1. **Email Verification** - Verify email during signup
2. **Password Reset** - Add forgot password flow
3. **API Rate Limiting** - prevent abuse (express-rate-limit)
4. **Refresh Tokens** - Better JWT security
5. **Search Optimization** - Full-text search, Elasticsearch
6. **Caching** - Redis for products list
7. **Image Upload** - S3 or Cloudinary for avatars
8. **Audit Logs** - Track user actions

### Medium Priority
9. **Soft Deletes** - Archive instead of delete
10. **Product Reviews Count** - Show popular products
11. **User Following** - Follow other users
12. **Review Reactions** - Like/helpful/unhelpful votes
13. **Advanced Filters** - Price range, rating filters
14. **Wishlist** - Save products for later
15. **Product Ratings Distribution** - Show 1-5 star breakdown

### Infrastructure & DevOps
16. **CI/CD Pipeline** - GitHub Actions/GitLab CI
17. **Observability** - Logging (Winston), Tracing (OpenTelemetry), Metrics
18. **Database Backups** - Automated backups
19. **Load Testing** - Performance testing
20. **Monitoring & Alerting** - Error tracking (Sentry)

### Performance & Scaling
21. **Database Indexing** - Add indexes for frequently queried fields
22. **Connection Pooling** - PgBouncer for large load
23. **Pagination Optimization** - Cursor-based pagination
24. **Image Optimization** - Responsive images, WebP

### Frontend Enhancements
25. **i18n** - Multi-language support
26. **Accessibility** - WCAG 2.1 AAA compliance
27. **Dark Mode** - Theme toggle

---

## 🎨 Design Decisions

### Review system

I decided not to run `aggregate()` after every write, because it can become slow when a product has many reviews. Instead I store `ratingSum` and `reviewCount` on `Product`, and I compute `averageRating` from them.

When a review is created/updated/deleted, I update the product counters with a small delta (add/subtract rating, and add/subtract 1 from count). I do it inside a transaction, so the review change and the product rating change happen together.

I also use optimistic locking (`updatedAt`) and retries. This helps when two requests update the same review at the same time (concurrent traffic).

### Swagger

I added Swagger so it is easy to explore the API and try requests:

- Swagger UI: `http://localhost:3000/api/docs`

To call protected endpoints, first login to get `accessToken`, then click **Authorize** in Swagger and paste `Bearer <accessToken>`.

### Why Single Database?
- This app is small, so one database is enough
- Simpler deployment and debugging
- Relational data models fit well together
- Can add caching layer later if needed

### Why Denormalized Ratings in Product?
- Query optimization: Avoid N+1 when listing products
- Pre computed for fast response
- Trade-off: Update complexity (trigger or logic)

### Why Upsert for Reviews?
- Simpler UX: One review per user per product
- Reduces UI complexity (no edit vs create decision)
- Enforced by unique database constraint
- Prevents duplicate reviews

### Why NestJS?
- SOLID principles built-in
- Excellent TypeScript support
- Dependency injection out of the box
- Active community and ecosystem
- Production-proven at scale

### Why Angular Material?
- Pre-built Material Design components
- Accessibility built-in
- Consistent design system
- Large community
- Professional appearance

### Why Standalone Components?
- Modern Angular (v14+) approach
- No module boilerplate
- Smaller bundle sizes
- Easier tree-shakeable

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add JWT token refresh endpoint
fix(reviews): correct rating calculation
docs(readme): update setup instructions
test(products): add pagination tests
chore(deps): upgrade Angular to 18.1
```

---

## 🤝 Contributing

### Code Quality Standards
- Strict TypeScript (`strict: true`)
- ESLint passes without warnings
- Prettier formatted
- No unused imports/variables
- Meaningful error messages
- Comprehensive tests

### Before Submitting PR
1. `pnpm format` - Format code
2. `pnpm lint` - Check linting
3. `pnpm test` - Run tests
4. `pnpm type-check` - Verify types
5. Update [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

MIT - See LICENSE file for details

---

## 🙏 Acknowledgments

- [NestJS Documentation](https://docs.nestjs.com)
- [Angular Documentation](https://angular.io)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Material Design Guidelines](https://material.io)
- [12 Factor App](https://12factor.net)

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Demo / portfolio project
