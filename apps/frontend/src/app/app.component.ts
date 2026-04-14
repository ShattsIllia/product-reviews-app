import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import type { UserModel } from './core/models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<UserModel | null>;
  headerAvatarLoadFailed = false;

  constructor() {
    this.currentUser$ = this.authService.getCurrentUser().pipe(
      tap(() => {
        this.headerAvatarLoadFailed = false;
      })
    );
    this.isAuthenticated$ = this.currentUser$.pipe(
      map((user) => {
        const isAuth = user !== null;
        return isAuth;
      })
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onHeaderAvatarError(): void {
    this.headerAvatarLoadFailed = true;
  }
}
