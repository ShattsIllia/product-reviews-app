# Quick Reference - Product Reviews App

## Start Here

### 1️⃣ First Time Setup (5 minutes)

```bash
cd product-reviews-app

# Make setup script executable
chmod +x scripts/setup.sh

# Run setup (installs, creates DB, seeds data)
bash scripts/setup.sh
```

This will:
- ✅ Install all dependencies
- ✅ Start PostgreSQL in Docker
- ✅ Run database migrations
- ✅ Seed demo data

### 2️⃣ Start Development Servers

```bash
# Terminal 1: Backend (Port 3000)
cd apps/backend
pnpm dev

# Terminal 2: Frontend (Port 4200)
cd apps/frontend
pnpm dev
```

Or start both from root:
```bash
pnpm dev
```

### 3️⃣ Access Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **Database Studio**: `pnpm db:studio` (opens http://localhost:5555)

---

## Demo Credentials

```
Admin User:
  Email: admin@example.com
  Password: admin123

Regular Users:
  Email: user1@example.com / Password: password123
  Email: user2@example.com / Password: password123
```

---

## Common Commands

### Database
```bash
pnpm db:migrate      # Create new migration
pnpm db:seed         # Reseed with demo data
pnpm db:reset        # Reset everything (dev only)
pnpm db:studio       # Open database GUI
```

### Development
```bash
pnpm dev             # Start all services
pnpm test            # Run all tests
pnpm test:watch      # Watch mode tests
pnpm test:cov        # Coverage report
pnpm e2e             # E2E tests
```

### Code Quality
```bash
pnpm format          # Format all code
pnpm format:check    # Check formatting
pnpm lint            # Run linter
pnpm type-check      # Check TypeScript
```

### Backend Specific
```bash
cd apps/backend
pnpm dev             # Start only backend
pnpm test            # Backend tests
pnpm prisma:generate # Regenerate Prisma types
pnpm build           # Build for production
```

### Frontend Specific
```bash
cd apps/frontend
pnpm dev             # Start only frontend
pnpm test            # Frontend tests
pnpm build           # Build for production
pnpm e2e             # E2E tests
```

---

## Project Structure at a Glance

```
root/
├── apps/
│   ├── backend/           # NestJS API
│   └── frontend/          # Angular SPA
├── packages/
│   └── shared-types/      # Shared TypeScript types
├── docs/
│   ├── API.md            # API documentation
│   └── DECISIONS.md      # Architecture decisions
├── docker-compose.yml    # PostgreSQL container
├── README.md             # Full documentation
└── package.json          # Root workspaces config
```

---

## Key Files to Know

### Backend Must-Know
- `apps/backend/src/app/controllers/` - API endpoints
- `apps/backend/src/app/services/` - Business logic
- `apps/backend/prisma/schema.prisma` - Database schema
- `apps/backend/src/main.ts` - App bootstrap
- `.env.local` - Backend environment variables

### Frontend Must-Know
- `apps/frontend/src/app/app.routes.ts` - Routing
- `apps/frontend/src/app/core/services/` - API clients
- `apps/frontend/src/app/features/` - Feature modules
- `apps/frontend/src/main.ts` - App bootstrap

---

## API Quick Reference

### Auth
```
POST   /api/auth/register          # Sign up
POST   /api/auth/login             # Sign in
GET    /api/auth/me                # Get current user
```

### Products
```
GET    /api/products               # List products
GET    /api/products/:id           # Product details
```

### Reviews
```
GET    /api/products/:productId/reviews      # List reviews
POST   /api/products/:productId/reviews      # Add/update review
PATCH  /api/reviews/:id                      # Update review
DELETE /api/reviews/:id                      # Delete review
```

### Users
```
GET    /api/users/me                # Get profile
PATCH  /api/users/me                # Update profile
```

---

## Environment Variables

### Create `.env` file (or copy from `.env.example`):

```env
# Backend
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/product_reviews_db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m

# Frontend
FRONTEND_URL=http://localhost:4200
```

---

## Troubleshooting

### Port Already in Use
```bash
# Port 5432 (PostgreSQL)
docker-compose down

# Port 3000 (Backend) or 4200 (Frontend)
# Kill process or change port in .env
```

### Database Issues
```bash
# Reset everything
docker-compose down -v
docker-compose up -d
pnpm db:migrate
pnpm db:seed
```

### Node Modules Issues
```bash
rm -rf node_modules
pnpm install
```

### Can't Connect to API
- Check backend is running: `curl http://localhost:3000/api`
- Check .env DATABASE_URL is correct
- Check PostgreSQL container is running: `docker ps`

---

## Testing

### Run Tests
```bash
pnpm test            # Run all tests once
pnpm test:watch      # Watch mode
pnpm test:cov        # Coverage report
```

### Run E2E Tests
```bash
pnpm e2e             # Run Playwright tests
pnpm e2e:ui          # Run with UI
pnpm e2e:debug       # Debug mode
```

---

## Next Steps

1. ✅ Run setup script
2. ✅ Start development servers
3. ✅ Open http://localhost:4200
4. ✅ Try logging in with demo credentials
5. ✅ Explore creating reviews
6. ✅ Check API docs: [docs/API.md](docs/API.md)
7. ✅ Read architecture: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Resources

- **README**: [README.md](README.md) - Complete documentation
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md) - Design decisions & patterns
- **API Docs**: [docs/API.md](docs/API.md) - Complete API reference
- **Design**: [docs/DECISIONS.md](docs/DECISIONS.md) - Why decisions were made
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

---

## Getting Help

1. Check [README.md](README.md) FAQ section
2. Read [docs/DECISIONS.md](docs/DECISIONS.md) for architecture questions
3. Review [docs/API.md](docs/API.md) for API questions
4. Check test files for usage examples

---

## Before Committing Code

```bash
# Make sure everything passes
pnpm format          # Format code
pnpm lint            # Check linting
pnpm type-check      # Check types
pnpm test            # Run tests  
pnpm e2e             # E2E tests
```

---

## Production Ready? ✅

This application includes:
- ✅ Type-safe code (TypeScript strict mode)
- ✅ Input validation (DTO validators)
- ✅ Error handling (custom exceptions)
- ✅ Security (JWT, password hashing)
- ✅ Database migrations (Prisma)
- ✅ Seeding scripts
- ✅ Docker setup
- ✅ Comprehensive documentation
- ✅ Test infrastructure
- ✅ Code quality tools

Ready to deploy! 🚀

---

**Happy coding! 💻**

For detailed information, see [README.md](README.md)
