# Tests & Examples Summary

This document provides an overview of all test files created and their purposes, serving as a reference for team members writing new tests.

## Test File Inventory

### Backend Tests

#### Unit Tests: Service Layer

**File:** `apps/backend/test/unit/auth.service.spec.ts` (120 lines)
- **Purpose:** Test authentication business logic in isolation
- **Key Test Suites:**
  - `describe('register')` - User registration tests
    - ✅ Register new user successfully
    - ✅ Throw ConflictException if email exists
  - `describe('login')` - Login tests
    - ✅ Login with correct credentials
    - ✅ Throw UnauthorizedException if user not found
    - ✅ Throw UnauthorizedException if password wrong
  - `describe('getProfile')` - Profile retrieval tests
    - ✅ Return user profile successfully
    - ✅ Throw UnauthorizedException if user not found
- **Patterns Used:**
  - Jest mocks for dependencies (PrismaService, JwtService)
  - Arrange-Act-Assert structure
  - Both success and error path testing

**File:** `apps/backend/test/unit/review.service.spec.ts` (220 lines)
- **Purpose:** Test review service with complex business logic
- **Key Test Suites:**
  - `describe('createReview')` - Create/upsert review tests
    - ✅ Create new review successfully
    - ✅ Update existing review (upsert pattern)
    - ✅ Throw NotFoundException if product doesn't exist
    - ✅ Recalculate product ratings after review
  - `describe('updateReview')` - Update tests
    - ✅ Update review if owner
    - ✅ Throw ForbiddenException if not owner
    - ✅ Throw NotFoundException if review doesn't exist
  - `describe('deleteReview')` - Delete tests
    - ✅ Delete review if owner
    - ✅ Throw ForbiddenException if not owner
  - `describe('getReviewsByProduct')` - Pagination tests
    - ✅ Return paginated reviews
    - ✅ Apply pagination correctly (skip/take)
  - `describe('getUserReview')` - Single review retrieval
    - ✅ Return user review for product
    - ✅ Return null if review doesn't exist
- **Patterns Used:**
  - Testing database constraints (unique review per user-product)
  - Ownership verification patterns
  - Pagination parameter testing
  - Mock aggregate functions for rating calculations

#### Integration Tests: Controller Layer

**File:** `apps/backend/test/integration/auth.controller.integration.spec.ts` (180 lines)
- **Purpose:** Test HTTP endpoints with realistic request/response flow
- **Key Test Suites:**
  - `describe('POST /auth/register')` - Registration endpoint
    - ✅ Register user and return token (201)
    - ✅ Return 400 for invalid email
    - ✅ Return 400 for short password
    - ✅ Return 409 for duplicate email
  - `describe('POST /auth/login')` - Login endpoint
    - ✅ Login user and return token (200)
    - ✅ Return 401 for invalid credentials
    - ✅ Return 404 for non-existent user
    - ✅ Return 400 for invalid email format
  - `describe('GET /auth/profile')` - Profile endpoint
    - ✅ Return user profile when authenticated
    - ✅ Return 401 when not authenticated
  - `describe('Error Handling')` - Error formatting tests
    - ✅ Return formatted error with statusCode, message, timestamp
    - ✅ Handle service errors gracefully
- **Patterns Used:**
  - supertest for HTTP testing
  - HTTP status code verification
  - Error response formatting validation
  - Service mocking for isolated endpoint testing

### Frontend Tests

#### Component Tests

**File:** `apps/frontend/test/components/login.component.spec.ts` (200 lines)
- **Purpose:** Test Angular component behavior and UI
- **Key Test Suites:**
  - `describe('Component Initialization')` - Setup tests
    - ✅ Create component
    - ✅ Initialize form with empty controls
    - ✅ Form invalid initially
  - `describe('Form Validation')` - Reactive form validation
    - ✅ Require email
    - ✅ Require valid email format
    - ✅ Require password
    - ✅ Validate form when inputs correct
  - `describe('Login Submission')` - Form submission tests
    - ✅ Call authService.login with form values
    - ✅ Navigate to products on success (async)
    - ✅ Set error message on failure
    - ✅ Show loading state during login
    - ✅ Not submit if form invalid
  - `describe('UI Display')` - DOM rendering tests
    - ✅ Display email input field
    - ✅ Display password input (type=password)
    - ✅ Display submit button
    - ✅ Display error message when login fails
    - ✅ Disable submit button when loading
  - `describe('Form Reset')` - State management tests
    - ✅ Clear error message when user types
    - ✅ Enable button when form valid
- **Patterns Used:**
  - TestBed setup for component testing
  - Jasmine spies for service mocking
  - Reactive form testing with `patchValue` and `markAsTouched`
  - Async testing with `done()` callbacks
  - DOM query and expectation on rendering

#### Service Tests

**File:** `apps/frontend/test/services/auth.service.spec.ts` (280 lines)
- **Purpose:** Test frontend auth service HTTP calls and state management
- **Key Test Suites:**
  - `describe('register')` - Registration tests
    - ✅ Register user and store token
    - ✅ Update auth state on success
    - ✅ Handle registration error (409 conflict)
  - `describe('login')` - Login tests
    - ✅ Login user and store token
    - ✅ Update current user on login
    - ✅ Set isAuthenticated to true
    - ✅ Handle login error (401)
  - `describe('logout')` - Logout tests
    - ✅ Clear auth state
    - ✅ Emit null for currentUser
  - `describe('getProfile')` - Profile fetch tests
    - ✅ Fetch user profile
    - ✅ Handle fetch error
  - `describe('Token Management')` - Token persistence
    - ✅ Retrieve stored token
    - ✅ Return null when token not stored
    - ✅ Persist token to localStorage
  - `describe('Authentication State')` - State tracking
    - ✅ Track authentication state
    - ✅ Restore state from localStorage
- **Patterns Used:**
  - HttpClientTestingModule for HTTP mocking
  - HttpTestingController for request verification
  - Observable testing with `subscribe` callbacks
  - localStorage mocking with beforeEach/afterEach
  - Error state testing with throwError

### E2E Tests

**File:** `apps/frontend/test/e2e/app.e2e.spec.ts` (550+ lines)
- **Purpose:** Test complete user workflows end-to-end
- **Key Test Suites:**
  - `describe('Authentication Flow')` - Auth user journeys
    - ✅ Register new user
    - ✅ Login existing user
    - ✅ Show error on invalid login
    - ✅ Logout user
  - `describe('Product Browsing')` - Product discovery
    - ✅ Display product catalog
    - ✅ Filter products by category
    - ✅ Search products
    - ✅ Navigate to product detail
  - `describe('Review Management')` - Review CRUD
    - ✅ Add review to product
    - ✅ Update existing review
    - ✅ Delete review
    - ✅ Display product rating after review
  - `describe('User Account')` - Account management
    - ✅ Navigate to account profile
    - ✅ Display user information
    - ✅ Update user profile
  - `describe('Error Handling')` - Error scenarios
    - ✅ Redirect unauthenticated users
    - ✅ Show validation errors
    - ✅ Handle network errors
  - `describe('Performance')` - Performance checks
    - ✅ Load page within 3 seconds
    - ✅ No layout shift during image load
- **Patterns Used:**
  - Playwright for async browser automation
  - `page.goto()` for navigation
  - `page.fill()` for form input
  - `page.click()` for user interaction
  - `expect()` matchers for assertions
  - `data-testid` attributes for element selection
  - `page.waitForURL()` for async navigation
  - `page.route()` for HTTP mocking

## Test Patterns & Best Practices

### Backend Test Patterns

#### 1. Service Unit Test Template
```typescript
describe('MyService', () => {
  let service: MyService;
  let dependency: Dependency;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: Dependency, useValue: mockDependency }
      ]
    }).compile();

    service = module.get<MyService>(MyService);
    dependency = module.get<Dependency>(Dependency);
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange
      jest.spyOn(dependency, 'method').mockResolvedValue(result);

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result).toEqual(expected);
      expect(dependency.method).toHaveBeenCalledWith(input);
    });
  });
});
```

#### 2. Error Handling Pattern
```typescript
it('should throw CustomException when condition', async () => {
  jest.spyOn(dependency, 'method').mockRejectedValue(customError);

  await expect(
    service.methodName(input)
  ).rejects.toThrow(CustomException);
});
```

#### 3. State Modification Pattern
```typescript
it('should update database after action', async () => {
  jest.spyOn(prismaService.entity, 'update').mockResolvedValue(updated);

  await service.updateEntity(id, data);

  expect(prismaService.entity.update).toHaveBeenCalledWith({
    where: { id },
    data
  });
});
```

### Frontend Test Patterns

#### 1. Component Test Template
```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let service: jasmine.SpyObj<MyService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MyService', ['method']);

    await TestBed.configureTestingModule({
      declarations: [MyComponent],
      providers: [
        { provide: MyService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MyService) as jasmine.SpyObj<MyService>;
    fixture.detectChanges();
  });

  it('should display data', () => {
    const element = fixture.nativeElement.querySelector('.data');
    expect(element.textContent).toContain('data');
  });
});
```

#### 2. Form Testing Pattern
```typescript
it('should validate form', () => {
  const control = component.form.get('email');
  control?.setValue('invalid');
  control?.markAsTouched();

  expect(control?.hasError('email')).toBeTruthy();
});
```

#### 3. Async Testing Pattern
```typescript
it('should navigate on success', (done) => {
  service.login.and.returnValue(of(response));
  component.onSubmit();

  setTimeout(() => {
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    done();
  }, 100);
});
```

### E2E Test Patterns

#### 1. Login Helper
```typescript
async function loginUser(page: Page, user: TestUser) {
  await page.goto('http://localhost:4200/auth/login');
  await page.fill('input[formControlName="email"]', user.email);
  await page.fill('input[formControlName="password"]', user.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/products/);
}
```

#### 2. Form Submission Pattern
```typescript
it('should submit form and show result', async () => {
  await page.fill('input[name="field"]', 'value');
  await page.click('button[type="submit"]');

  const message = page.locator('.success-message');
  await expect(message).toBeVisible();
});
```

#### 3. Data Validation Pattern
```typescript
it('should display correct data', async () => {
  const title = page.locator('[data-testid="title"]');
  await expect(title).toContainText('expected');

  const count = page.locator('[data-testid="count"]');
  expect(await count.textContent()).toBe('5');
});
```

## Test Naming Conventions

### Service Tests
```
should [action] when [condition]
should [action] and [side effect]
should throw [Exception] when [condition]

Examples:
- should create review and update product rating
- should throw ConflictException when email exists
- should recalculate averageRating after delete
```

### Component Tests
```
should [display/handle/verify] [what] when [condition]
should [action] on [trigger]

Examples:
- should display error message when login fails
- should navigate to products on successful login
- should disable button when form invalid
```

### E2E Tests
```
should [complete workflow] from [start] to [end]
should [verify behavior] in [scenario]

Examples:
- should add review to product after login
- should filter products by category
- should display validation error on submit
```

## Coverage Targets

| Layer | Target | Files | Tool |
|-------|--------|-------|------|
| Services | 80%+ | `*.service.spec.ts` | Jest |
| Controllers | 70%+ | `*.controller.spec.ts` | Jest + Supertest |
| Components | 70%+ | `*.component.spec.ts` | Jasmine + Karma |
| E2E | All critical journeys | `*.e2e.spec.ts` | Playwright |

## Running Tests for Development

### Full Test Suite
```bash
# Backend
cd apps/backend
pnpm test                    # Run once
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage report

# Frontend
cd apps/frontend
pnpm test                    # Run once
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage report

# E2E
pnpm e2e                     # Run all
pnpm e2e:ui                  # Visual test runner
pnpm e2e:debug              # Step through tests
```

### Quick Development Flow

1. **Write code** in feature branch
2. **Write tests** following patterns above
3. **Run tests** in watch mode: `pnpm test:watch`
4. **Check coverage** before commit: `pnpm test:cov`
5. **Run E2E** before PR: `pnpm e2e`

## Mocking Strategies

### Backend
- **Prisma:** Mock all `prismaService` calls
- **JWT:** Mock `JwtService.sign()` and `.verify()`
- **Config:** Mock `ConfigService.get()`
- **External APIs:** Mock HTTP calls with `jest.mock()`

### Frontend
- **HttpClient:** Use `HttpClientTestingModule`
- **Router:** `jasmine.createSpyObj('Router', ['navigate'])`
- **Services:** `jasmine.createSpyObj('Service', ['method'])`
- **RxJS:** Return `of()` or `throwError()` observables

### E2E
- **API:** Route intercepts with `page.route()`
- **Network:** Simulate latency with `page.route(...).delay(ms)`
- **Errors:** Abort requests with `route.abort()`

## Test Data / Fixtures

Use realistic test data:
```typescript
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'USER'
};

const mockProduct = {
  id: 'product-123',
  name: 'Laptop',
  price: 999.99,
  averageRating: 4.5,
  reviewCount: 10
};
```

## Debugging Test Failures

### Backend
```bash
# Single test file
pnpm test -- auth.service.spec.ts

# Matching pattern
pnpm test -- --testNamePattern="should register"

# With debug output
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### Frontend
```bash
# Single component
pnpm test -- --include='**/login.component.spec.ts'

# Watch for development
pnpm test:watch

# Chrome debugging
ng test --browsers=Chrome
```

### E2E
```bash
# Step through tests
pnpm e2e:debug

# Single test
npx playwright test test/e2e/app.e2e.spec.ts -g "should add review"

# See browser during execution
pnpm e2e --headed

# Debug traces
pnpm e2e --trace on
```

## Next Steps

1. **Add more test files** following these patterns
2. **Reach coverage targets** (80% services, 70% components)
3. **Document test strategies** for new features
4. **Add CI/CD checks** to block low-coverage PRs
5. **Team training** on test patterns and best practices
