import fs from 'fs';
import os from 'os';
import path from 'path';
import { prepare } from './prepare';
import { pull } from './pull';

jest.mock('./prepare');

interface AtlasTranslations {
  path?: string,
  dependencies?: string[],
}

function createPackage(baseDir: string, name: string, atlasTranslations?: AtlasTranslations): void {
  const pkgDir = path.join(baseDir, 'node_modules', name);
  fs.mkdirSync(pkgDir, { recursive: true });
  fs.writeFileSync(
    path.join(pkgDir, 'package.json'),
    JSON.stringify({ name, ...(atlasTranslations !== undefined ? { atlasTranslations } : {}) }),
    { encoding: 'utf8' },
  );
}

function createSite(baseDir: string, atlasTranslations?: AtlasTranslations): void {
  fs.writeFileSync(
    path.join(baseDir, 'package.json'),
    JSON.stringify({ name: 'test-site', ...(atlasTranslations !== undefined ? { atlasTranslations } : {}) }),
    { encoding: 'utf8' },
  );
}

const tmpPrefix = path.join(os.tmpdir(), 'translations-test-');

describe('pull', () => {
  let mockExecSync: jest.Mock;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecSync = jest.fn();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('calls atlas pull', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/frontend-app-authn'] });
    createPackage(tmp.path, '@openedx/frontend-app-authn', {
      path: 'translations/frontend-app-authn/src/i18n',
    });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(mockExecSync).toHaveBeenCalledTimes(1);
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('atlas pull'));
  });

  it('does not call atlas pull when dependencies list is empty', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: [] });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it('does not call atlas pull when all dependencies fail to resolve', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/missing'] });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: false });

    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it('calls atlas pull with one FROM:TO mapping', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/frontend-app-authn'] });
    createPackage(tmp.path, '@openedx/frontend-app-authn', {
      path: 'translations/frontend-app-authn/src/i18n',
    });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('translations/frontend-app-authn/src/i18n:src/i18n/messages/@openedx/frontend-app-authn'),
    );
  });

  it('includes atlasOptions in the atlas pull command when provided', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/frontend-app-authn'] });
    createPackage(tmp.path, '@openedx/frontend-app-authn', {
      path: 'translations/frontend-app-authn/src/i18n',
    });

    const atlasOptions = '--repository=https://github.com/example/translations --revision=main';
    pull({
      siteRoot: tmp.path,
      execSync: mockExecSync,
      shouldPrepare: false,
      atlasOptions,
    });

    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining(atlasOptions));
  });

  it('collects transitive dependency paths', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', {
      path: 'translations/authn/src/i18n',
      dependencies: ['@openedx/frontend-base'],
    });
    createPackage(tmp.path, '@openedx/frontend-base', {
      path: 'translations/frontend-base/src/i18n',
      dependencies: ['@openedx/paragon'],
    });
    createPackage(tmp.path, '@openedx/paragon', { path: 'translations/paragon/src/i18n' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('translations/authn/src/i18n:src/i18n/messages/@openedx/authn'));
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('translations/frontend-base/src/i18n:src/i18n/messages/@openedx/frontend-base'));
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('translations/paragon/src/i18n:src/i18n/messages/@openedx/paragon'));
  });

  it('deduplicates shared dependencies so each appears only once', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn', '@openedx/learning'] });
    createPackage(tmp.path, '@openedx/authn', {
      path: 'translations/authn/src/i18n',
      dependencies: ['@openedx/paragon'],
    });
    createPackage(tmp.path, '@openedx/learning', {
      path: 'translations/learning/src/i18n',
      dependencies: ['@openedx/paragon'],
    });
    createPackage(tmp.path, '@openedx/paragon', { path: 'translations/paragon/src/i18n' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    const atlasArgs = mockExecSync.mock.calls[0][0] as string;
    // split yields N+1 parts when the target appears N times
    const occurrences = atlasArgs.split('translations/paragon/src/i18n:src/i18n/messages/@openedx/paragon').length - 1;
    expect(occurrences).toBe(1);
  });

  it('detects circular dependencies, warns, and still collects both paths', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', {
      path: 'translations/authn/src/i18n',
      dependencies: ['@openedx/paragon'],
    });
    createPackage(tmp.path, '@openedx/paragon', {
      path: 'translations/paragon/src/i18n',
      dependencies: ['@openedx/authn'], // circular
    });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(warnSpy).toHaveBeenCalledWith('translations:pull: Circular dependency detected: @openedx/authn → @openedx/paragon → @openedx/authn, skipping.');
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('@openedx/authn'));
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('@openedx/paragon'));
  });

  it('uses the full scoped package name as the TO alias', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/frontend-app-authn'] });
    createPackage(tmp.path, '@openedx/frontend-app-authn', {
      path: 'translations/authn/src/i18n',
    });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining(':src/i18n/messages/@openedx/frontend-app-authn'));
    expect(mockExecSync).not.toHaveBeenCalledWith(expect.stringContaining(':src/i18n/messages/frontend-app-authn'));
  });

  it('does not touch the site-messages directory', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    const siteMessagesDir = path.join(tmp.path, 'src', 'i18n', 'site-messages');
    fs.mkdirSync(siteMessagesDir, { recursive: true });
    const arJson = path.join(siteMessagesDir, 'ar.json');
    fs.writeFileSync(arJson, '{"key":"value"}', { encoding: 'utf8' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: false });

    expect(fs.readdirSync(siteMessagesDir)).toEqual(['ar.json']);
    expect(fs.readFileSync(arJson, { encoding: 'utf8' })).toBe('{"key":"value"}');
  });

  it('clears messages/ directory before pulling', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    const staleFile = path.join(tmp.path, 'src', 'i18n', 'messages', 'old-package', 'ar.json');
    fs.mkdirSync(path.dirname(staleFile), { recursive: true });
    fs.writeFileSync(staleFile, '{"key":"stale"}', { encoding: 'utf8' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(fs.existsSync(staleFile)).toBe(false);
  });

  it('runs prepare by default after pulling', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });

    expect(jest.mocked(prepare)).toHaveBeenCalledWith({ siteRoot: tmp.path });
  });

  it('skips prepare when shouldPrepare is false', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: false });

    expect(jest.mocked(prepare)).not.toHaveBeenCalled();
  });

  it('warns and continues when a package is missing from node_modules', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn', '@openedx/missing'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: false });

    expect(warnSpy).toHaveBeenCalledWith('translations:pull: Package @openedx/missing not found in node_modules, skipping.');
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('@openedx/authn'));
    expect(mockExecSync).not.toHaveBeenCalledWith(expect.stringContaining('@openedx/missing'));
  });

  it('warns and continues when a dependency has no atlasTranslations config', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn', '@openedx/no-translations'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });
    createPackage(tmp.path, '@openedx/no-translations');

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: false });

    expect(warnSpy).toHaveBeenCalledWith('translations:pull: No atlasTranslations config in @openedx/no-translations, skipping.');
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('@openedx/authn'));
    expect(mockExecSync).not.toHaveBeenCalledWith(expect.stringContaining('@openedx/no-translations'));
  });

  it('throws an informative error when the site has no atlasTranslations field', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path);

    expect(() => {
      pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: true });
    }).toThrow('No atlasTranslations field in package.json');
  });

  it('surfaces atlas command failures', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    const failingExecSync = () => {
      throw new Error('atlas exited with code 1');
    };

    expect(() => {
      pull({ siteRoot: tmp.path, execSync: failingExecSync, shouldPrepare: false });
    }).toThrow('atlas exited with code 1');
  });

  it('follows dependencies of a package with no path without logging a warning', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/meta-package'] });
    createPackage(tmp.path, '@openedx/meta-package', {
      dependencies: ['@openedx/paragon'],
    });
    createPackage(tmp.path, '@openedx/paragon', { path: 'translations/paragon/src/i18n' });

    pull({ siteRoot: tmp.path, execSync: mockExecSync, shouldPrepare: false });

    expect(warnSpy).not.toHaveBeenCalled();
    expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('translations/paragon/src/i18n:src/i18n/messages/@openedx/paragon'));
    expect(mockExecSync).not.toHaveBeenCalledWith(expect.stringContaining('@openedx/meta-package'));
  });
});
