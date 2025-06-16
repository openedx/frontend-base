import { EnvironmentTypes, SiteConfig } from '../types';

const siteConfig: SiteConfig = {
  siteId: 'test',
  siteName: 'Open edX',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',

  environment: EnvironmentTypes.TEST,
  apps: [],
  segmentKey: 'segment_whoa',
};

export default siteConfig;
