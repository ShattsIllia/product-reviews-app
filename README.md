# Product Reviews App - Full-Stack Application

[CI](https://github.com/ShattsIllia/product-reviews-app/actions/workflows/ci.yml)

> A full-stack Product Reviews system built with **Angular 18**, **NestJS**, **PostgreSQL**, and **Prisma**.
>
> I tried to keep it clean and easy to understand, without over engineering.

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

- `**apps/frontend`**: Angular SPA (UI)
- `**apps/backend`**: NestJS REST API
- `**packages/shared-types**`: shared TypeScript types

### Testing

- **Jest** - Unit & integration tests
- **Supertest** - HTTP endpoint testing
- **Jasmine/Karma** - Angular component testing
- **Playwright** - E2E testing

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

### 3. Run Development Servers

Start both in parallel (recommended):

```bash
pnpm dev
```

- **Frontend**: `http://localhost:4200`
- **Backend**: `http://localhost:3000` (API under `http://localhost:3000/api/v1`)

Or start them in separate terminals:

```bash
# Terminal 1: Backend (NestJS)
cd apps/backend
pnpm dev
```

```bash
# Terminal 2: Frontend (Angular)
cd apps/frontend
pnpm dev
```

### 4. Access Application

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api/v1
- **Database Studio:** http://localhost:5555

> Note: the backend sets a global prefix `api/v1`, so all REST routes are under `/api/v1/...`.

### Key Files

- **Database Schema:** [apps/backend/prisma/schema.prisma](apps/backend/prisma/schema.prisma)
- **API Routes:** `apps/backend/src/features/**/**.controller.ts`
- **Auth Service:** [apps/backend/src/features/auth/auth.service.ts](apps/backend/src/features/auth/auth.service.ts)
- **Frontend Routes:** [apps/frontend/src/app/app.routes.ts](apps/frontend/src/app/app.routes.ts)

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

Notes:

- **Token storage**: the frontend stores the JWT access token in **localStorage** (simple for a demo). For a real product I would use **httpOnly cookies** + refresh tokens to reduce XSS risk.
- **Secrets**: do not commit real secrets. In production I would use a secret manager.
- **One env source**: I keep only **root `.env`** as the source of truth. The backend reads `../../.env`. For Prisma commands inside `apps/backend`, the setup script creates a symlink `apps/backend/.env` → `../../.env`.

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

- Rate limiting
- Email verification
- Password reset
- Refresh tokens
- Audit logging
- HTTPS enforcement
- helmet.js security headers
- API versioning

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

1. **Soft Deletes** - Archive instead of delete
2. **Product Reviews Count** - Show popular products
3. **User Following** - Follow other users
4. **Review Reactions** - Like/helpful/unhelpful votes
5. **Advanced Filters** - Price range, rating filters
6. **Wishlist** - Save products for later
7. **Product Ratings Distribution** - Show 1-5 star breakdown

### Infrastructure & DevOps

1. **CI/CD Pipeline** - GitHub Actions/GitLab CI
2. **Observability** - Logging (Winston), Tracing (OpenTelemetry), Metrics
3. **Database Backups** - Automated backups
4. **Load Testing** - Performance testing
5. **Monitoring & Alerting** - Error tracking (Sentry)

### Performance & Scaling

1. **Database Indexing** - Add indexes for frequently queried fields
2. **Connection Pooling** - PgBouncer for large load
3. **Pagination Optimization** - Cursor-based pagination
4. **Image Optimization** - Responsive images, WebP

### Frontend Enhancements

1. **i18n** - Multi-language support
2. **Accessibility** - WCAG 2.1 AAA compliance
3. **Dark Mode** - Theme toggle

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

## 🏗 Architecture

### High-Level Architecture

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