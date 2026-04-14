import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../services/user.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'setCurrentUser',
    ]) as jasmine.SpyObj<AuthService>;
    const userSpy = jasmine.createSpyObj('UserService', [
      'getProfile',
      'updateProfile',
    ]) as jasmine.SpyObj<UserService>;
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']) as jasmine.SpyObj<Router>;

    userSpy.getProfile.and.returnValue(
      of({
        id: 'u1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'USER' as const,
        avatarUrl: null,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load profile into form', () => {
    expect(component).toBeTruthy();
    expect(component.form.get('email')?.value).toBe('test@example.com');
    expect(component.form.get('displayName')?.value).toBe('Test User');
    expect(userService.getProfile).toHaveBeenCalled();
    expect(authService.setCurrentUser).toHaveBeenCalled();
  });

  it('onCancel should navigate to products', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('onExit should navigate to products', () => {
    component.onExit();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
