import '@testing-library/jest-dom';
import siteConfig from 'site.config';
import { mergeSiteConfig } from '../runtime';

jest.mock('universal-cookie', () => {
  const mCookie = {
    get: jest.fn(),
    remove: jest.fn(),
  };
  return jest.fn(() => mCookie);
});

mergeSiteConfig(siteConfig);
