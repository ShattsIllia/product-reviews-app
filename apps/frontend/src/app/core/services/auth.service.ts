import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import type { AuthResponseDto, RegistrationResponse, UserProfileDto } from '../models/api';
import type { UserModel } from '../models/models';
import { mapUserDto } from '../models/mappers';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private currentUser$ = new BehaviorSubject<UserModel | null>(null);
  private accessToken$ = new BehaviorSubject<string | null>(null);

  constructor() {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.accessToken$.next(token);
      this.currentUser$.next(JSON.parse(user) as UserModel);
    } else {
      // Initialize with null values for unauthenticated users
      this.accessToken$.next(null);
      this.currentUser$.next(null);
    }
  }

  /**
   * Register a new user
   * Returns registration message, does not authenticate
   * User must login separately to get access token
   */
  register(email: string, password: string, displayName: string): Observable<RegistrationResponse> {
    return this.http
      .post<RegistrationResponse>(`${this.configService.getAuthUrl('/register')}`, {
        email,
        password,
        displayName,
      })
      .pipe(
        catchError((error) => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Login user and fetch their profile
   * First authenticates, then fetches user profile from /users/me endpoint
   */
  login(email: string, password: string): Observable<UserModel> {
    return this.http
      .post<AuthResponseDto>(`${this.configService.getAuthUrl('/login')}`, {
        email,
        password,
      })
      .pipe(
        tap((response) => this.storeAccessToken(response.accessToken)),
        switchMap(() => this.fetchAndStoreUserProfile()),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Fetch current user profile from /users/me endpoint
   * Requires valid access token
   */
  private fetchAndStoreUserProfile(): Observable<UserModel> {
    return this.http.get<UserProfileDto>(`${this.configService.getUsersUrl()}/me`).pipe(
      tap((userDto) => {
        const user = mapUserDto(userDto);
        this.currentUser$.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      switchMap((userDto) => {
        const user = mapUserDto(userDto);
        return new Observable<UserModel>((observer) => {
          observer.next(user);
          observer.complete();
        });
      }),
      catchError((error) => {
        console.error('Fetch profile error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.currentUser$.next(null);
    this.accessToken$.next(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
  }

  getAccessToken(): string | null {
    const inMemory = this.accessToken$.value;
    if (inMemory) return inMemory;

    const persisted = localStorage.getItem('accessToken');
    if (persisted) {
      this.accessToken$.next(persisted);
    }
    return persisted;
  }

  getCurrentUser(): Observable<UserModel | null> {
    return this.currentUser$.asObservable();
  }

  setCurrentUser(user: UserModel | null): void {
    this.currentUser$.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  isAuthenticatedSync(): boolean {
    // Guard and UI should not rely only on in-memory state.
    // This keeps auth consistent after refresh / initial load.
    return this.getAccessToken() !== null;
  }

  private storeAccessToken(token: string): void {
    this.accessToken$.next(token);
    localStorage.setItem('accessToken', token);
  }
}
