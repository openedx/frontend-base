export interface AuthService {
  getAuthenticatedHttpClient(options?: Record<string, unknown>): unknown,
  getHttpClient(options?: Record<string, unknown>): unknown,
  getLoginRedirectUrl(redirectUrl?: string): string,
  redirectToLogin(redirectUrl?: string): void,
  getLogoutRedirectUrl(redirectUrl?: string): string,
  redirectToLogout(redirectUrl?: string): void,
  getAuthenticatedUser(): Record<string, unknown> | null,
  setAuthenticatedUser(authUser: Record<string, unknown>): void,
  fetchAuthenticatedUser(options?: Record<string, unknown>): Promise<Record<string, unknown> | null>,
  ensureAuthenticatedUser(redirectUrl?: string): Promise<Record<string, unknown>>,
  hydrateAuthenticatedUser(): Promise<null>,
}
