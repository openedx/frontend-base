import { getSiteConfig } from '@openedx/frontend-base';

describe('site config', () => {
  it('is merged from site.config.test.tsx before the suite runs', () => {
    const siteConfig = getSiteConfig();

    expect(siteConfig.siteId).toBe('test');
    expect(siteConfig.apps).toHaveLength(1);
  });
});
