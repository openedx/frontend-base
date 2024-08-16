/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import siteConfig from 'site.config';
import { setConfig } from '../runtime';
import { configDefaults } from '../runtime/config';

jest.mock('universal-cookie', () => {
  const mCookie = {
    get: jest.fn(),
    remove: jest.fn(),
  };
  return jest.fn(() => mCookie);
});

setConfig({ ...configDefaults, ...siteConfig });
