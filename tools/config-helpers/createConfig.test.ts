import { ConfigTypes } from '../types';
import createConfig from './createConfig';

describe('createConfig', () => {
  describe('test config', () => {
    it('excludes the packages directory from the module and test path crawls', () => {
      const config = createConfig(ConfigTypes.TEST);

      expect(config.modulePathIgnorePatterns).toContain('<rootDir>/packages/');
      expect(config.testPathIgnorePatterns).toContain('<rootDir>/packages/');
    });

    it('appends to the base arrays rather than replacing them', () => {
      const config = createConfig(ConfigTypes.TEST, {
        testPathIgnorePatterns: [
          '<rootDir>/src/setupTest.js',
        ],
      });

      expect(config.testPathIgnorePatterns).toEqual([
        ...createConfig(ConfigTypes.TEST).testPathIgnorePatterns,
        '<rootDir>/src/setupTest.js',
      ]);
    });
  });
});
