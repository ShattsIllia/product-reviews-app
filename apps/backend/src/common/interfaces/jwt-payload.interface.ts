import type { Role } from '@shared';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: Role;
}

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}
