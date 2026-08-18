export interface AnalyticsService {
  sendTrackingLogEvent(eventName: string, properties: object): Promise<void>,
  identifyAuthenticatedUser(userId: string | number, traits?: Record<string, unknown>): void,
  identifyAnonymousUser(traits?: Record<string, unknown>): void,
  sendTrackEvent(eventName?: string, properties?: Record<string, unknown>): void,
  sendPageEvent(category: string, name: string, properties?: Record<string, unknown>): void,
}
