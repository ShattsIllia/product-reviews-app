import * as crypto from 'crypto';

/**
 * Generate a secure verification token for email confirmation
 * Uses cryptographically secure random bytes
 *
 * @returns Random token (32 bytes = 64 hex chars)
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calculate token expiration time
 *
 * @param expirationMinutes How long the token is valid (default 24 hours)
 * @returns Expiration datetime
 *
 * SECURITY NOTE:
 * - Tokens expire after 24 hours to limit brute force window
 * - If token expires, user must re-register or request new token
 * - Shorter expiration (e.g., 15 minutes) is more secure but less user-friendly
 */
export function getTokenExpirationTime(expirationMinutes: number = 24 * 60): Date {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
  return expiresAt;
}

/**
 * Check if a token has expired
 *
 * @param expiresAt Token expiration datetime
 * @returns true if expired, false if still valid
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
