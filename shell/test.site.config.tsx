import { EnvironmentTypes, ProjectSiteConfig } from '../types';

const config: ProjectSiteConfig = {
  apps: [],

  appId: 'runtime',
  baseUrl: 'http://localhost:8080',
  environment: EnvironmentTypes.TEST,
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  segmentKey: 'segment_whoa',
  siteName: 'edX',
};

export default config;
