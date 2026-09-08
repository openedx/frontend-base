import { User } from '../../types';

export interface AuthService {
  getAuthenticatedHttpClient(options?: Record<string, unknown>): unknown;
  getHttpClient(options?: Record<string, unknown>): unknown;
  getLoginRedirectUrl(redirectUrl?: string): string;
  redirectToLogin(redirectUrl?: string): void;
  getLogoutRedirectUrl(redirectUrl?: string): string;
  redirectToLogout(redirectUrl?: string): void;
  getAuthenticatedUser(): User | null;
  setAuthenticatedUser(authUser: User): void;
  fetchAuthenticatedUser(options?: Record<string, unknown>): Promise<User | null>;
  ensureAuthenticatedUser(redirectUrl?: string): Promise<User>;
  hydrateAuthenticatedUser(): Promise<void>;
}
