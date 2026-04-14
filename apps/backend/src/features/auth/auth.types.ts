export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface RegistrationResponse {
  message: string;
}
