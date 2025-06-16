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

global.PARAGON_THEME = {
  paragon: {
    version: '1.0.0',
    themeUrls: {
      core: {
        fileName: 'core.min.css',
      },
      defaults: {
        light: 'light',
      },
      variants: {
        light: {
          fileName: 'light.min.css',
        },
      },
    },
  },
  brand: {
    version: '1.0.0',
    themeUrls: {
      core: {
        fileName: 'core.min.css',
      },
      defaults: {
        light: 'light',
      },
      variants: {
        light: {
          fileName: 'light.min.css',
        },
      },
    },
  },
};
