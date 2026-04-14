import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { UpdateUserInput, UserDto } from '../../../core/models/api';
import type { UserModel } from '../../../core/models/models';
import { mapUserDto } from '../../../core/models/mappers';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  getProfile(): Observable<UserModel> {
    return this.http.get<UserDto>(`${this.config.apiUrl}/users/me`).pipe(map(mapUserDto));
  }

  updateProfile(data: UpdateUserInput): Observable<UserModel> {
    return this.http.patch<UserDto>(`${this.config.apiUrl}/users/me`, data).pipe(map(mapUserDto));
  }
}
