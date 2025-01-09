export {
  configureAnalytics,
  getAnalyticsService,
  identifyAnonymousUser,
  identifyAuthenticatedUser,
  resetAnalyticsService,
  sendPageEvent,
  sendTrackEvent,
  sendTrackingLogEvent
} from './interface';
export { default as MockAnalyticsService } from './MockAnalyticsService';
export { default as SegmentAnalyticsService } from './SegmentAnalyticsService';
