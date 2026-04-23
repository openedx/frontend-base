import {
  APP_RESOURCE,
  BRAND_PACKAGE,
} from './getStylesheetRule';

describe('stylesheet classification', () => {
  describe('BRAND_PACKAGE', () => {
    const re = BRAND_PACKAGE.name as RegExp;

    it('matches @openedx/brand-*', () => {
      expect(re.test('@openedx/brand-openedx')).toBe(true);
    });

    it('matches @edx/brand-*', () => {
      expect(re.test('@edx/brand-foo')).toBe(true);
    });

    it('matches bare @openedx/brand', () => {
      expect(re.test('@openedx/brand')).toBe(true);
    });

    it('does not match unrelated scoped packages', () => {
      expect(re.test('@openedx/paragon')).toBe(false);
      expect(re.test('@openedx/branding')).toBe(false);
    });
  });

  describe('APP_RESOURCE', () => {
    it('matches a node_modules path', () => {
      expect(APP_RESOURCE.test('/site/node_modules/some-pkg/index.js')).toBe(true);
    });

    it('matches an npm-workspace packages path', () => {
      expect(APP_RESOURCE.test('/site/packages/some-pkg/index.js')).toBe(true);
    });

    it('does not match a site source path', () => {
      expect(APP_RESOURCE.test('/site/src/component.scss')).toBe(false);
    });
  });
});
