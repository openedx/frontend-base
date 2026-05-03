import { ACTIVE_ROLES_CHANGED, CONFIG_CHANGED } from '../constants';
import * as subscriptions from '../subscriptions';
import {
  addActiveWidgetRole,
  addAppConfigs,
  getActiveRouteRoles,
  getActiveWidgetRoles,
  getAppConfig,
  getProvides,
  getSiteConfig,
  mergeSiteConfig,
  removeActiveWidgetRole,
  setActiveRouteRoles,
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

    it('does not mutate the previous siteConfig reference', () => {
      const before = getSiteConfig();
      const beforeSnapshot = { ...before };

      mergeSiteConfig({ siteName: 'Updated' });

      const after = getSiteConfig();
      expect(after).not.toBe(before);
      expect(before).toEqual(beforeSnapshot);
    });

    it('does not mutate previously-held nested arrays', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'existing', config: { VALUE: 'before' } }],
      });
      const beforeApps = getSiteConfig().apps;
      const beforeAppsLength = beforeApps!.length;
      const beforeApp = beforeApps![0];
      const beforeAppConfig = { ...beforeApp.config };

      mergeSiteConfig({
        apps: [{ appId: 'existing', config: { VALUE: 'after' } }],
      });

      // The previously-held array and app object must be unchanged.
      expect(beforeApps!.length).toBe(beforeAppsLength);
      expect(beforeApp.config).toEqual(beforeAppConfig);
      // ...even though the live siteConfig sees the merged value.
      expect(getSiteConfig().apps![0].config!.VALUE).toBe('after');
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

    it('should preserve a lazy `slots` getter through the merge', () => {
      /* Regression: lodash.merge invokes any getter on the source app while
       * `siteConfig.apps` is still the pre-merge value, then snapshots the
       * return value onto the merged copy. Apps with lazy `slots` getters
       * (e.g. createLegacyPluginApp) need the getter to survive so it can
       * resolve later, against the post-merge sibling apps. */
      let getterCalls = 0;
      const lazyApp: any = {
        appId: 'lazy-app',
        get slots() {
          getterCalls += 1;
          return [{ slotId: 'fake.slot', id: 'w', op: 'widgetAppend', element: null }];
        },
      };

      mergeSiteConfig({ apps: [lazyApp] });

      const merged = getSiteConfig().apps!.find(a => a.appId === 'lazy-app')!;
      const callsAfterMerge = getterCalls;
      // Reading slots should still hit the getter (i.e. it survived as a getter).
      void merged.slots;
      void merged.slots;
      expect(getterCalls).toBeGreaterThan(callsAfterMerge);
    });
  });

  describe('app merging (limitAppMergeToConfig: true)', () => {
    it('should do nothing when no existing apps', () => {
      mergeSiteConfig(
        { apps: [{ appId: 'new-app', config: { VALUE: 'test' } }] },
        { limitAppMergeToConfig: true }
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
        { limitAppMergeToConfig: true }
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
        { limitAppMergeToConfig: true }
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
        { limitAppMergeToConfig: true }
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
        { limitAppMergeToConfig: true }
      );

      expect(publishSpy).toHaveBeenCalledWith(CONFIG_CHANGED);

      // Config should be unchanged
      expect(getSiteConfig().apps![0].config!.ORIGINAL).toBe('value');
    });
  });

  describe('getAppConfig with commonAppConfig', () => {
    it('should return commonAppConfig values for an app with no config', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        commonAppConfig: { COMMON_KEY: 'common-value' },
        apps: [{ appId: 'test-app' }],
      });
      addAppConfigs();

      const config = getAppConfig('test-app');
      expect(config).toEqual({ COMMON_KEY: 'common-value' });
    });

    it('should let app-specific config override commonAppConfig', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        commonAppConfig: { SHARED: 'common', COMMON_ONLY: 'yes' },
        apps: [{ appId: 'test-app', config: { SHARED: 'app-specific', APP_ONLY: 'yes' } }],
      });
      addAppConfigs();

      const config = getAppConfig('test-app');
      expect(config).toEqual({
        SHARED: 'app-specific',
        COMMON_ONLY: 'yes',
        APP_ONLY: 'yes',
      });
    });

    it('should return app config as-is when commonAppConfig is not set', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [{ appId: 'test-app', config: { VALUE: 'test' } }],
      });
      addAppConfigs();

      const config = getAppConfig('test-app');
      expect(config).toEqual({ VALUE: 'test' });
    });

    it('should deep merge commonAppConfig with app config', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        commonAppConfig: { NESTED: { a: 1, b: 2 } },
        apps: [{ appId: 'test-app', config: { NESTED: { b: 3, c: 4 } } }],
      });
      addAppConfigs();

      const config = getAppConfig('test-app');
      expect(config).toEqual({ NESTED: { a: 1, b: 3, c: 4 } });
    });
  });

  describe('getProvides', () => {
    it('should return empty array when no apps exist', () => {
      setSiteConfig({ ...defaultSiteConfig, apps: [] });
      expect(getProvides('org.openedx.frontend.provides.testProvidesId.v1')).toEqual([]);
    });

    it('should return empty array when no apps provide data for the consumer', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [
          { appId: 'app-one', config: { VALUE: 'test' } },
          { appId: 'app-two' },
        ],
      });
      expect(getProvides('org.openedx.frontend.provides.testProvidesId.v1')).toEqual([]);
    });

    it('should collect provided data from apps that declare it', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [
          {
            appId: 'app-one',
            provides: {
              'org.openedx.frontend.provides.testProvidesId.v1': { urlPattern: '/one/' },
            },
          },
          {
            appId: 'app-two',
            provides: {
              'org.openedx.frontend.provides.testProvidesId.v1': { urlPattern: '/two/' },
            },
          },
        ],
      });

      const result = getProvides('org.openedx.frontend.provides.testProvidesId.v1');
      expect(result).toEqual([
        { urlPattern: '/one/' },
        { urlPattern: '/two/' },
      ]);
    });

    it('should only return data for the requested consumer', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [
          {
            appId: 'app-one',
            provides: {
              'org.openedx.frontend.provides.testProvidesId.v1': { urlPattern: '/one/' },
              'org.openedx.frontend.provides.otherProvidesId.v1': { showBranding: true },
            },
          },
        ],
      });

      const headerData = getProvides('org.openedx.frontend.provides.testProvidesId.v1');
      expect(headerData).toEqual([{ urlPattern: '/one/' }]);

      const footerData = getProvides('org.openedx.frontend.provides.otherProvidesId.v1');
      expect(footerData).toEqual([{ showBranding: true }]);
    });

    it('should skip apps without provides', () => {
      setSiteConfig({
        ...defaultSiteConfig,
        apps: [
          { appId: 'app-one' },
          {
            appId: 'app-two',
            provides: {
              'org.openedx.frontend.provides.testProvidesId.v1': { urlPattern: '/two/' },
            },
          },
          { appId: 'app-three', config: { VALUE: 'test' } },
        ],
      });

      const result = getProvides('org.openedx.frontend.provides.testProvidesId.v1');
      expect(result).toEqual([{ urlPattern: '/two/' }]);
    });
  });
});

describe('active role mutators', () => {
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    /* Reset shared state. setActiveRouteRoles uses isEqual, so any non-empty
       array different from the current one will reset; we follow up with []. */
    setActiveRouteRoles(['__reset__']);
    setActiveRouteRoles([]);
    for (const role of getActiveWidgetRoles()) {
      while (getActiveWidgetRoles().includes(role)) {
        removeActiveWidgetRole(role);
      }
    }
    publishSpy = jest.spyOn(subscriptions, 'publish');
  });

  afterEach(() => {
    publishSpy.mockRestore();
  });

  describe('setActiveRouteRoles', () => {
    it('publishes ACTIVE_ROLES_CHANGED when the roles change', () => {
      setActiveRouteRoles(['role-a']);
      expect(publishSpy).toHaveBeenCalledWith(ACTIVE_ROLES_CHANGED);
      expect(getActiveRouteRoles()).toEqual(['role-a']);
    });

    it('does not publish when called with a deeply-equal array', () => {
      setActiveRouteRoles(['role-a']);
      publishSpy.mockClear();

      setActiveRouteRoles(['role-a']);
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('publishes again when the roles transition back to a different value', () => {
      setActiveRouteRoles(['role-a']);
      setActiveRouteRoles(['role-b']);
      publishSpy.mockClear();

      setActiveRouteRoles(['role-a']);
      expect(publishSpy).toHaveBeenCalledWith(ACTIVE_ROLES_CHANGED);
    });
  });

  describe('addActiveWidgetRole / removeActiveWidgetRole', () => {
    it('publishes only on the 0->1 transition when adding', () => {
      addActiveWidgetRole('widget-role');
      expect(publishSpy).toHaveBeenCalledWith(ACTIVE_ROLES_CHANGED);
      expect(getActiveWidgetRoles()).toContain('widget-role');

      publishSpy.mockClear();
      addActiveWidgetRole('widget-role');
      addActiveWidgetRole('widget-role');
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('publishes only on the 1->0 transition when removing', () => {
      addActiveWidgetRole('widget-role');
      addActiveWidgetRole('widget-role');
      addActiveWidgetRole('widget-role');
      publishSpy.mockClear();

      removeActiveWidgetRole('widget-role');
      removeActiveWidgetRole('widget-role');
      expect(publishSpy).not.toHaveBeenCalled();
      expect(getActiveWidgetRoles()).toContain('widget-role');

      removeActiveWidgetRole('widget-role');
      expect(publishSpy).toHaveBeenCalledWith(ACTIVE_ROLES_CHANGED);
      expect(getActiveWidgetRoles()).not.toContain('widget-role');
    });

    it('does nothing when removing a role that was never added', () => {
      removeActiveWidgetRole('never-added');
      expect(publishSpy).not.toHaveBeenCalled();
      expect(getActiveWidgetRoles()).not.toContain('never-added');
    });
  });
});
