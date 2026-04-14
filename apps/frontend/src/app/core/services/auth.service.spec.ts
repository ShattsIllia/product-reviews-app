import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import type { RegistrationResponse } from '../models/api';
import type { UserModel } from '../models/models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const authBase = 'http://localhost:3000/api/v1/auth';
  const usersBase = 'http://localhost:3000/api/v1/users';

  const mockUser: UserModel = {
    id: 'user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'USER',
    avatarUrl: null,
  };

  const mockRegistrationResponse: RegistrationResponse = {
    message: 'Account registered successfully. Please login with your credentials.',
  };

  const mockLoginTokenResponse = {
    accessToken: 'mock-jwt-token',
  };

  /** Completes login: POST /login then GET /me (matches AuthService.login). */
  function flushLoginSuccess() {
    const loginReq = httpMock.expectOne(`${authBase}/login`);
    loginReq.flush(mockLoginTokenResponse);
    const meReq = httpMock.expectOne(`${usersBase}/me`);
    meReq.flush(mockUser);
  }

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['getAuthUrl', 'getUsersUrl']);
    configServiceSpy.getAuthUrl.and.callFake((path: string) => `${authBase}${path}`);
    configServiceSpy.getUsersUrl.and.returnValue(usersBase);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: ConfigService, useValue: configServiceSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register user and return registration message', (done) => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        displayName: 'New User',
      };

      service
        .register(registerData.email, registerData.password, registerData.displayName)
        .subscribe((response) => {
          expect(response).toEqual(mockRegistrationResponse);
          expect(localStorage.getItem('accessToken')).toBeNull();
          done();
        });

      const req = httpMock.expectOne(`${authBase}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockRegistrationResponse);
    });

    it('should not authenticate on registration', (done) => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        displayName: 'New User',
      };

      service
        .register(registerData.email, registerData.password, registerData.displayName)
        .subscribe(() => {
          service.getCurrentUser().subscribe((user) => {
            expect(user).toBeNull();
            done();
          });
        });

      const req = httpMock.expectOne(`${authBase}/register`);
      req.flush(mockRegistrationResponse);
    });

    it('should handle registration error', (done) => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        displayName: 'User',
      };

      const errorResponse = {
        statusCode: 409,
        message: 'Email already exists',
      };

      service
        .register(registerData.email, registerData.password, registerData.displayName)
        .subscribe(
          () => fail('should have failed'),
          (error) => {
            expect(error.status).toBe(409);
            done();
          }
        );

      const req = httpMock.expectOne(`${authBase}/register`);
      req.flush(errorResponse, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('login', () => {
    it('should login user, fetch profile, and return UserModel', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(loginData.email, loginData.password).subscribe((response) => {
        expect(response).toEqual(mockUser);
        expect(localStorage.getItem('accessToken')).toBe(mockLoginTokenResponse.accessToken);
        done();
      });

      const loginReq = httpMock.expectOne(`${authBase}/login`);
      expect(loginReq.request.method).toBe('POST');
      expect(loginReq.request.body).toEqual(loginData);
      loginReq.flush(mockLoginTokenResponse);
      const meReq = httpMock.expectOne(`${usersBase}/me`);
      meReq.flush(mockUser);
    });

    it('should update current user on login', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(loginData.email, loginData.password).subscribe(() => {
        service.getCurrentUser().subscribe((user) => {
          expect(user).toEqual(mockUser);
          done();
        });
      });

      flushLoginSuccess();
    });

    it('should set isAuthenticated to true on login', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(loginData.email, loginData.password).subscribe(() => {
        expect(service.isAuthenticatedSync()).toBeTruthy();
        done();
      });

      flushLoginSuccess();
    });

    it('should handle login error', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const errorResponse = {
        statusCode: 401,
        message: 'Invalid credentials',
      };

      service.login(loginData.email, loginData.password).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
          expect(localStorage.getItem('accessToken')).toBeNull();
          done();
        }
      );

      const req = httpMock.expectOne(`${authBase}/login`);
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear auth state on logout', () => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.isAuthenticatedSync()).toBeFalsy();
    });

    it('should emit null for currentUser on logout', (done) => {
      service.login('test@example.com', 'password123').subscribe(() => {
        service.logout();

        service.getCurrentUser().subscribe((user) => {
          expect(user).toBeNull();
          done();
        });
      });

      flushLoginSuccess();
    });
  });

  describe('Token Management', () => {
    it('should retrieve stored token', () => {
      const testToken = 'test-jwt-token';
      localStorage.setItem('accessToken', testToken);

      expect(service.getAccessToken()).toBe(testToken);
    });

    it('should return null when token not stored', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('should persist token to localStorage', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(loginData.email, loginData.password).subscribe(() => {
        const token = localStorage.getItem('accessToken');
        expect(token).toBe(mockLoginTokenResponse.accessToken);
        done();
      });

      flushLoginSuccess();
    });
  });

  describe('Authentication State', () => {
    it('should track authentication state', (done) => {
      expect(service.isAuthenticatedSync()).toBeFalsy();

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(loginData.email, loginData.password).subscribe(() => {
        expect(service.isAuthenticatedSync()).toBeTruthy();
        done();
      });

      flushLoginSuccess();
    });

    it('should restore authentication state from localStorage', () => {
      localStorage.setItem('accessToken', 'mock-token');
      expect(service.getAccessToken()).toBe('mock-token');
    });
  });
});
