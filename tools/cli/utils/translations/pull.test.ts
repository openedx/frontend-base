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
  let mockExecFileSync: jest.Mock;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecFileSync = jest.fn();
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

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(mockExecFileSync).toHaveBeenCalledTimes(1);
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining(['pull']));
  });

  it('does not call atlas pull when dependencies list is empty', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: [] });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(mockExecFileSync).not.toHaveBeenCalled();
  });

  it('does not call atlas pull when all dependencies fail to resolve', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/missing'] });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(mockExecFileSync).not.toHaveBeenCalled();
  });

  it('calls atlas pull with one FROM:TO mapping', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/frontend-app-authn'] });
    createPackage(tmp.path, '@openedx/frontend-app-authn', {
      path: 'translations/frontend-app-authn/src/i18n',
    });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(mockExecFileSync).toHaveBeenCalledWith(
      'atlas', expect.arrayContaining(['translations/frontend-app-authn/src/i18n:src/i18n/messages/@openedx/frontend-app-authn']),
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
      execFileSync: mockExecFileSync,
      shouldPrepare: false,
      atlasOptions,
    });

    expect(mockExecFileSync).toHaveBeenCalledWith(
      'atlas', expect.arrayContaining(['--repository=https://github.com/example/translations', '--revision=main']),
    );
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

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining(['translations/authn/src/i18n:src/i18n/messages/@openedx/authn']));
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining(['translations/frontend-base/src/i18n:src/i18n/messages/@openedx/frontend-base']));
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining(['translations/paragon/src/i18n:src/i18n/messages/@openedx/paragon']));
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

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    const atlasArgs = mockExecFileSync.mock.calls[0][1] as string[];
    const occurrences = atlasArgs.filter(a => a === 'translations/paragon/src/i18n:src/i18n/messages/@openedx/paragon').length;
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

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(warnSpy).toHaveBeenCalledWith('translations:pull: Circular dependency detected: test-site → @openedx/authn → @openedx/paragon → @openedx/authn, skipping.');
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/authn')]));
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/paragon')]));
  });

  it('uses the full scoped package name as the TO alias', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/frontend-app-authn'] });
    createPackage(tmp.path, '@openedx/frontend-app-authn', {
      path: 'translations/authn/src/i18n',
    });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining(':src/i18n/messages/@openedx/frontend-app-authn')]));
    expect(mockExecFileSync).not.toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining(':src/i18n/messages/frontend-app-authn')]));
  });

  it('does not touch the site-messages directory', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    const siteMessagesDir = path.join(tmp.path, 'src', 'i18n', 'site-messages');
    fs.mkdirSync(siteMessagesDir, { recursive: true });
    const arJson = path.join(siteMessagesDir, 'ar.json');
    fs.writeFileSync(arJson, '{"key":"value"}', { encoding: 'utf8' });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

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

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(fs.existsSync(staleFile)).toBe(false);
  });

  it('replaces stale translation file with newly pulled content', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    const translationFile = path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'authn', 'ar.json');
    fs.mkdirSync(path.dirname(translationFile), { recursive: true });
    fs.writeFileSync(translationFile, '{"key":"stale"}', { encoding: 'utf8' });

    mockExecFileSync.mockImplementation(() => {
      // wx flag fails if the file already exists, so this throws unless clearing happened first
      fs.mkdirSync(path.dirname(translationFile), { recursive: true });
      fs.writeFileSync(translationFile, '{"key":"new"}', { encoding: 'utf8', flag: 'wx' });
    });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(fs.readFileSync(translationFile, { encoding: 'utf8' })).toBe('{"key":"new"}');
  });

  it('runs prepare by default after pulling', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });

    expect(jest.mocked(prepare)).toHaveBeenCalledWith({ siteRoot: tmp.path });
  });

  it('skips prepare when shouldPrepare is false', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(jest.mocked(prepare)).not.toHaveBeenCalled();
  });

  it('warns and continues when a package is missing from node_modules', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn', '@openedx/missing'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(warnSpy).toHaveBeenCalledWith('translations:pull: Package @openedx/missing not found in node_modules, skipping.');
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/authn')]));
    expect(mockExecFileSync).not.toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/missing')]));
  });

  it('warns and continues when a dependency has no atlasTranslations config', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn', '@openedx/no-translations'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });
    createPackage(tmp.path, '@openedx/no-translations');

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(warnSpy).toHaveBeenCalledWith('translations:pull: No atlasTranslations config in @openedx/no-translations, skipping.');
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/authn')]));
    expect(mockExecFileSync).not.toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/no-translations')]));
  });

  it('pulls translations for the top-level package when atlasTranslations.path is set', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { path: 'translations/test-site/src/i18n' });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(mockExecFileSync).toHaveBeenCalledWith(
      'atlas', expect.arrayContaining(['translations/test-site/src/i18n:src/i18n/messages/test-site']),
    );
  });

  it('throws when atlasTranslations.path is set but package.json has no name field', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    fs.writeFileSync(
      path.join(tmp.path, 'package.json'),
      JSON.stringify({ atlasTranslations: { path: 'translations/test-site/src/i18n' } }),
      { encoding: 'utf8' },
    );

    expect(() => {
      pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });
    }).toThrow('atlasTranslations.path is set');
  });

  it('throws an informative error when the site has no atlasTranslations field', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path);

    expect(() => {
      pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: true });
    }).toThrow('No atlasTranslations field in');
  });

  it('surfaces atlas command failures', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/authn'] });
    createPackage(tmp.path, '@openedx/authn', { path: 'translations/authn/src/i18n' });

    const failingExecFileSync = () => {
      throw new Error('atlas exited with code 1');
    };

    expect(() => {
      pull({ siteRoot: tmp.path, execFileSync: failingExecFileSync, shouldPrepare: false });
    }).toThrow('atlas exited with code 1');
  });

  it('follows dependencies of a package with no path without logging a warning', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    createSite(tmp.path, { dependencies: ['@openedx/meta-package'] });
    createPackage(tmp.path, '@openedx/meta-package', {
      dependencies: ['@openedx/paragon'],
    });
    createPackage(tmp.path, '@openedx/paragon', { path: 'translations/paragon/src/i18n' });

    pull({ siteRoot: tmp.path, execFileSync: mockExecFileSync, shouldPrepare: false });

    expect(warnSpy).not.toHaveBeenCalled();
    expect(mockExecFileSync).toHaveBeenCalledWith('atlas', expect.arrayContaining(['translations/paragon/src/i18n:src/i18n/messages/@openedx/paragon']));
    expect(mockExecFileSync).not.toHaveBeenCalledWith('atlas', expect.arrayContaining([expect.stringContaining('@openedx/meta-package')]));
  });
});
