import '@testing-library/jest-dom';

import siteConfig from 'site.config';
import { mergeSiteConfig } from './config';

jest.mock('universal-cookie', () => {
  const mCookie = {
    get: jest.fn(),
    remove: jest.fn(),
  };
  return jest.fn(() => mCookie);
});

mergeSiteConfig(siteConfig);
