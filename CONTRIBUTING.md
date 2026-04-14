# Contributing Guidelines

Thank you for contributing to Product Reviews! This document provides guidelines for contributing.

## Development Setup

### Prerequisites
- Node.js 20.11+
- pnpm 8.13+
- Docker & Docker Compose
- Git

### Initial Setup
```bash
# Clone and install
git clone https://github.com/ShattsIllia/product-reviews-app.git
cd product-reviews-app
pnpm install

# Setup database
docker-compose up -d
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```

---

## Code Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types
- All functions typed
- Interfaces for public APIs

### Naming Conventions
- Files: kebab-case (`auth.service.ts`)
- Classes: PascalCase (`AuthService`)
- Variables/Functions: camelCase (`getUserId()`)
- Constants: UPPER_SNAKE_CASE (`JWT_SECRET`)

### Formatting
```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint
pnpm lint

# Type check
pnpm type-check
```

### No Dead Code
- Remove unused imports
- Delete unused variables
- Clean up old comments

---

## Commit Messages

Follow Conventional Commits format:

```
type(scope): subject

- feat(auth): add password reset
- fix(reviews): correct rating calculation
- docs(readme): update setup steps
- test(products): add pagination tests
- chore(deps): upgrade Angular
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `chore` - Dependencies, config
- `refactor` - Code restructuring
- `perf` - Performance improvements

**Scope:**
- `auth` - Authentication
- `products` - Products feature
- `reviews` - Reviews feature
- `account` - User account
- `db` - Database/Migrations
- `api` - API endpoints

---

## Testing

### Before Submitting PR

```bash
# Run all tests
pnpm test

# Add tests for changes
# - Unit tests for services
# - Tests for new components
# - E2E tests for user flows

# Check coverage
pnpm test:cov

# Make sure E2E passes
pnpm e2e
```

### Test Standards
- Test file next to source: `*.spec.ts`
- Meaningful test names
- Tests isolated and independent
- Mock external dependencies
- Cover happy path + error cases

### Example Test
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: { user: { create: jest.Mock } };

  beforeEach(() => {
    mockPrisma = { user: { create: jest.fn() } };
    service = new AuthService(mockPrisma);
  });

  it('should register user successfully', async () => {
    const result = await service.register({
      email: 'test@example.com',
      password: 'pass',
      displayName: 'Test'
    });
    
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw on duplicate email', async () => {
    mockPrisma.user.create.mockRejectedValue(
      new ConflictException('Email exists')
    );
    
    await expect(service.register(...)).rejects.toThrow();
  });
});
```

---

## PR Guidelines

### Before Creating PR
1. ✅ Code formatted: `pnpm format`
2. ✅ Linting passes: `pnpm lint`
3. ✅ Types pass: `pnpm type-check`
4. ✅ Tests pass: `pnpm test`
5. ✅ E2E tests pass: `pnpm e2e`
6. ✅ No console errors/warnings
7. ✅ Meaningful commit messages

### PR Title Format
```
[Type] Scope: Brief description

[feat] auth: add password recovery flow
[fix] reviews: fix rating calculation bug
[docs] readme: update installation steps
```

### PR Description
```markdown
## Changes
- Brief description of changes

## Testing
- How was this tested?
- Any new tests added?

## Screenshots (if applicable)
- Before/after screenshots

## Issues
- Fixes #123
- Related to #456
```

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Performance considered

---

## Adding Features

### Feature Branch
```bash
git checkout -b feat/feature-name
```

### Step-by-Step
1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Update documentation
5. Commit with conventional message
6. Create PR

### Example: Add New Endpoint

```bash
# 1. Create migrations if needed
pnpm db:migrate

# 2. Update schema.prisma
# ... modify schema ...

# 3. Generate Prisma types
pnpm prisma:generate

# 4. Create service
# apps/backend/src/app/services/new.service.ts

# 5. Add controller
# apps/backend/src/app/controllers/new.controller.ts

# 6. Write tests
# apps/backend/test/integration/new.spec.ts

# 7. Update frontend (if needed)

# 8. Test everything
pnpm test && pnpm e2e

# 9. Commit
git commit -m "feat(scope): add new endpoint"
```

---

## Architecture & Patterns

### Backend Patterns
- **DTOs**: Request/response validation
- **Services**: Business logic
- **Guards**: Authentication/authorization
- **Exceptions**: Custom error handling
- **Decorators**: @CurrentUser, @Auth

### Frontend Patterns
- **Standalone Components**: No NgModules
- **Services**: HTTP/state management
- **Guards**: Route protection
- **Interceptors**: Auth headers

---

## Performance Guidelines

### Backend
- Avoid N+1 queries (use `.include()` in Prisma)
- Index frequently queried fields
- Cache expensive operations (future: Redis)
- Use pagination

### Frontend
- Lazy load modules
- OnPush change detection
- Unsubscribe from observables
- Avoid memory leaks

---

## Documentation

### Update When:
- Adding new features
- Changing API endpoints
- Modifying database schema
- Adding environment variables

### Files to Update:
- `README.md` - Overview, setup, usage
- `docs/API.md` - API documentation
- `docs/DECISIONS.md` - Architecture decisions
- Inline code comments for complex logic

---

## Dependencies

### Adding New Package

Only add if necessary. Discuss first!

```bash
# Production
pnpm add package-name

# Development
pnpm add -D package-name

# Update lock file
pnpm install
```

### Update Existing
```bash
pnpm up package-name
```

### Remove
```bash
pnpm remove package-name
```

---

## Common Tasks

### Add Database Migration
```bash
# 1. Modify schema.prisma
# 2. Create migration
pnpm db:migrate
# 3. Schema types auto-generated
```

### Add API Endpoint
```bash
# 1. Add route to controller
# 2. Implement service logic
# 3. Add DTO validation
# 4. Write integration tests
# 5. Document in API.md
```

### Add Component
```bash
# 1. Create component file
# 2. Add tests
# 3. Add to feature module
# 4. Use in page
```

### Fix Bug
```bash
git checkout -b fix/bug-description
# ... fix ...
pnpm test
git commit -m "fix(scope): brief description"
```

---

## Troubleshooting

### Database Issues
```bash
# Reset database
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

### TypeScript Errors
```bash
pnpm type-check
# Fix errors shown
```

### Tests Failing
```bash
pnpm test --verbose
# Check error messages
# Check test isolation
```

---

## Questions?

- Check existing issues/PRs
- Read architecture docs
- Review existing code patterns
- Ask in PR discussions

---

## Code of Conduct

- Respectful communication
- Inclusive environment
- Focus on code, not person
- Constructive feedback

---

## License

By contributing, you agree your code is MIT licensed.

---

Thank you for contributing! 🎉
