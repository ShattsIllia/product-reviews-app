import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'logout']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty controls', () => {
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
    });

    it('should have form invalid initially', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should initialize loading state as false', () => {
      expect(component.isLoading).toBeFalsy();
    });

    it('should initialize hidePassword as true', () => {
      expect(component.hidePassword).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should require email', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid-email');

      expect(emailControl?.hasError('email')).toBeTruthy();
    });

    it('should accept valid email', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('test@example.com');

      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should require password', () => {
      const passwordControl = component.form.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('required')).toBeTruthy();
    });

    it('should require minimum password length', () => {
      const passwordControl = component.form.get('password');
      passwordControl?.setValue('short');

      expect(passwordControl?.hasError('minlength')).toBeTruthy();
    });

    it('should validate form when inputs are correct', () => {
      component.form.get('email')?.setValue('test@example.com');
      component.form.get('password')?.setValue('password123');

      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('Login Submission', () => {
    it('should not submit if form is invalid', () => {
      component.form.get('email')?.setValue('invalid');

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with form values', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        accessToken: 'mock-token',
        user: {
          id: '1',
          email: loginData.email,
          displayName: 'Test',
          role: 'USER' as const,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      authService.login.and.returnValue(of(mockResponse));

      component.form.patchValue(loginData);
      component.onSubmit();

      setTimeout(() => {
        expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
        done();
      }, 100);
    });

    it('should navigate to products on successful login', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        accessToken: 'mock-token',
        expiresIn: 900,
        user: {
          id: '1',
          email: loginData.email,
          displayName: 'Test',
          role: 'USER' as const,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      authService.login.and.returnValue(of(mockResponse));

      component.form.patchValue(loginData);
      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/products']);
        done();
      }, 100);
    });

    it('should handle login error and show message', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
        statusText: 'Unauthorized',
      });

      authService.login.and.returnValue(throwError(() => errorResponse));

      component.form.patchValue(loginData);
      component.onSubmit();

      setTimeout(() => {
        expect(component.isLoading).toBeFalsy();
        done();
      }, 100);
    });

    it('should set loading state during login', (done) => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        accessToken: 'mock-token',
        expiresIn: 900,
        user: {
          id: '1',
          email: loginData.email,
          displayName: 'Test',
          role: 'USER' as const,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      authService.login.and.returnValue(of(mockResponse));

      component.form.patchValue(loginData);
      expect(component.isLoading).toBeFalsy();

      component.onSubmit();

      setTimeout(() => {
        expect(component.isLoading).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('UI Display', () => {
    it('should display email input field', () => {
      const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should display password input field', () => {
      const passwordInput = fixture.nativeElement.querySelector(
        'input[formControlName="password"]'
      );
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.type).toBe('password');
    });

    it('should display submit button', () => {
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    it('should disable submit button when form invalid', () => {
      component.form.get('email')?.setValue('');
      component.form.get('password')?.setValue('');
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should enable submit button when form valid', () => {
      component.form.get('email')?.setValue('test@example.com');
      component.form.get('password')?.setValue('password123');
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeFalsy();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBeTruthy();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeFalsy();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeTruthy();
    });
  });
});
