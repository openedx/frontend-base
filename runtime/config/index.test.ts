import { CONFIG_CHANGED } from '../constants';
import * as subscriptions from '../subscriptions';
import {
  getSiteConfig,
  mergeSiteConfig,
  setSiteConfig,
} from './index';

const defaultSiteConfig = {
  siteId: '',
  baseUrl: '',
  siteName: '',
  loginUrl: '',
  logoutUrl: '',
  lmsBaseUrl: '',
  apps: [],
};

describe('mergeSiteConfig', () => {
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    setSiteConfig({ ...defaultSiteConfig });
    publishSpy = jest.spyOn(subscriptions, 'publish');
  });

  afterEach(() => {
    publishSpy.mockRestore();
  });

  describe('top-level config merging', () => {
    it('should merge new values into site config', () => {
      mergeSiteConfig({
        siteName: 'Test Site',
        lmsBaseUrl: 'http://fake.lms.url',
      });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);
      expect(getSiteConfig().siteName).toBe('Test Site');
      expect(getSiteConfig().lmsBaseUrl).toBe('http://fake.lms.url');
    });

    it('should override existing values', () => {
      setSiteConfig({ ...defaultSiteConfig, siteName: 'Original' });
      publishSpy.mockClear();

      mergeSiteConfig({ siteName: 'Updated' });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);
      expect(getSiteConfig().siteName).toBe('Updated');
    });

    it('should preserve existing values not in new config', () => {
      setSiteConfig({ ...defaultSiteConfig, siteName: 'Original', lmsBaseUrl: 'http://original.url' });
      publishSpy.mockClear();

      mergeSiteConfig({ siteName: 'Updated' });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);
      expect(getSiteConfig().siteName).toBe('Updated');
      expect(getSiteConfig().lmsBaseUrl).toBe('http://original.url');
    });
  });

  describe('app merging (full merge, default behavior)', () => {
    it('should add new apps when none exist', () => {
      mergeSiteConfig({
        apps: [{
          appId: 'new-app',
          config: { FEATURE: true },
        }],
      });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);
      expect(getSiteConfig().apps).toHaveLength(1);
      expect(getSiteConfig().apps![0].appId).toBe('new-app');
      expect(getSiteConfig().apps![0].config!.FEATURE).toBe(true);
    });

    it('should merge apps by appId, not array index', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [
          { appId: 'app-one', config: { VALUE: 'one' } },
          { appId: 'app-two', config: { VALUE: 'two' } },
        ],
      });
      publishSpy.mockClear();

      // New config has apps in different order
      mergeSiteConfig({
        apps: [
          { appId: 'app-two', config: { EXTRA: 'added-to-two' } },
        ],
      });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      const apps = getSiteConfig().apps!;
      expect(apps).toHaveLength(2);

      const appOne = apps.find(a => a.appId === 'app-one')!;
      const appTwo = apps.find(a => a.appId === 'app-two')!;

      // app-one should be unchanged
      expect(appOne.config!.VALUE).toBe('one');
      expect(appOne.config!.EXTRA).toBeUndefined();

      // app-two should have merged config
      expect(appTwo.config!.VALUE).toBe('two');
      expect(appTwo.config!.EXTRA).toBe('added-to-two');
    });

    it('should add new apps while preserving existing ones', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'existing-app', config: { VALUE: 'existing' } }],
      });
      publishSpy.mockClear();

      mergeSiteConfig({
        apps: [{ appId: 'new-app', config: { VALUE: 'new' } }],
      });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      const apps = getSiteConfig().apps!;
      expect(apps).toHaveLength(2);
      expect(apps.find(a => a.appId === 'existing-app')).toBeDefined();
      expect(apps.find(a => a.appId === 'new-app')).toBeDefined();
    });

    it('should deep merge app properties', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{
          appId: 'test-app',
          config: { NESTED: { a: 1, b: 2 } },
        }],
      });
      publishSpy.mockClear();

      mergeSiteConfig({
        apps: [{
          appId: 'test-app',
          config: { NESTED: { b: 3, c: 4 } },
        }],
      });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      const app = getSiteConfig().apps!.find(a => a.appId === 'test-app')!;
      expect(app.config!.NESTED).toEqual({ a: 1, b: 3, c: 4 });
    });
  });

  describe('app merging (appConfigOnly: true)', () => {
    it('should do nothing when no existing apps', () => {
      mergeSiteConfig(
        { apps: [{ appId: 'new-app', config: { VALUE: 'test' } }] },
        { appConfigOnly: true }
      );

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);
      expect(getSiteConfig().apps).toHaveLength(0);
    });

    it('should not add new apps', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'existing-app', config: { VALUE: 'existing' } }],
      });
      publishSpy.mockClear();

      mergeSiteConfig(
        { apps: [{ appId: 'new-app', config: { VALUE: 'new' } }] },
        { appConfigOnly: true }
      );

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);
      expect(getSiteConfig().apps).toHaveLength(1);
      expect(getSiteConfig().apps![0].appId).toBe('existing-app');
    });

    it('should only merge config for existing apps', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{
          appId: 'test-app',
          config: { ORIGINAL: 'value', OVERRIDE: 'old' },
        }],
      });
      publishSpy.mockClear();

      mergeSiteConfig(
        {
          apps: [{
            appId: 'test-app',
            config: { OVERRIDE: 'new', ADDED: 'extra' },
          }],
        },
        { appConfigOnly: true }
      );

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      const app = getSiteConfig().apps![0];
      expect(app.config!.ORIGINAL).toBe('value');
      expect(app.config!.OVERRIDE).toBe('new');
      expect(app.config!.ADDED).toBe('extra');
    });

    it('should merge by appId, not array index', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [
          { appId: 'app-one', config: { VALUE: 'one' } },
          { appId: 'app-two', config: { VALUE: 'two' } },
        ],
      });
      publishSpy.mockClear();

      // New config only has app-two at index 0
      mergeSiteConfig(
        {
          apps: [{ appId: 'app-two', config: { EXTRA: 'added' } }],
        },
        { appConfigOnly: true }
      );

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      const apps = getSiteConfig().apps!;
      const appOne = apps.find(a => a.appId === 'app-one')!;
      const appTwo = apps.find(a => a.appId === 'app-two')!;

      // app-one should be unchanged (was at index 0, but new config had app-two at index 0)
      expect(appOne.config!.VALUE).toBe('one');
      expect(appOne.config!.EXTRA).toBeUndefined();

      // app-two should have merged config
      expect(appTwo.config!.VALUE).toBe('two');
      expect(appTwo.config!.EXTRA).toBe('added');
    });
  });

  describe('edge cases', () => {
    it('should handle empty apps array in new config', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'existing', config: { VALUE: 'test' } }],
      });
      publishSpy.mockClear();

      mergeSiteConfig({ apps: [] });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      // Should be unchanged
      expect(getSiteConfig().apps).toHaveLength(1);
      expect(getSiteConfig().apps![0].appId).toBe('existing');
    });

    it('should handle undefined apps in new config', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'existing', config: { VALUE: 'test' } }],
      });
      publishSpy.mockClear();

      mergeSiteConfig({ siteName: 'Updated' });

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      // Apps should be unchanged
      expect(getSiteConfig().apps).toHaveLength(1);
      expect(getSiteConfig().siteName).toBe('Updated');
    });

    it('should handle app with no config property', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'test-app', config: { ORIGINAL: 'value' } }],
      });
      publishSpy.mockClear();

      mergeSiteConfig(
        { apps: [{ appId: 'test-app' }] },
        { appConfigOnly: true }
      );

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      // Config should be unchanged
      expect(getSiteConfig().apps![0].config!.ORIGINAL).toBe('value');
    });
  });
});
