import { SiteConfig } from '../types';
import NewRelicLoggingService from '../runtime/logging/NewRelicLoggingService';
import SegmentAnalyticsService from '../runtime/analytics/SegmentAnalyticsService';
import AxiosJwtAuthService from '../runtime/auth/AxiosJwtAuthService';

const config: SiteConfig = {
    loggingService: NewRelicLoggingService,
    analyticsService: SegmentAnalyticsService,
    authService: AxiosJwtAuthService,
    siteId: '',
    siteName: '',
    baseUrl: '',
    lmsBaseUrl: '',
    loginUrl: '',
    logoutUrl: '',
}

export default config;