import fs from 'fs';
import os from 'os';
import path from 'path';
import { prepare } from './prepare';

type MessagesStructure = Record<string, Record<string, object>>;

function setupI18nMessages(baseDir: string, structure: MessagesStructure): void {
  for (const [packagePath, files] of Object.entries(structure)) {
    const pkgDir = path.join(baseDir, 'src', 'i18n', 'messages', packagePath);
    fs.mkdirSync(pkgDir, { recursive: true });
    for (const [filename, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(pkgDir, filename), JSON.stringify(content), { encoding: 'utf8' });
    }
  }
}

function setupSiteMessages(baseDir: string, files: Record<string, object>): void {
  const dir = path.join(baseDir, 'src', 'i18n', 'site-messages');
  fs.mkdirSync(dir, { recursive: true });
  for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(content), { encoding: 'utf8' });
  }
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, { encoding: 'utf8' });
}

const tmpPrefix = path.join(os.tmpdir(), 'translations-test-');

describe('prepare', () => {
  it('generates per-package import and export blocks properly', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': {
        'fr.json': { hello: 'bonjour', world: 'monde' },
      },
    });

    prepare({ siteRoot: tmp.path });

    const authnIndex = readFile(path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'frontend-app-authn', 'index.ts'));
    expect(authnIndex).toBe(
      "import fr from './fr.json';\n"
      + '\n'
      + 'export default {\n'
      + "  'fr': fr,\n"
      + '};\n',
    );
  });

  it('generates messages.ts import and export blocks properly', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': {
        'fr.json': { hello: 'bonjour', world: 'monde' },
      },
    });

    prepare({ siteRoot: tmp.path });

    const messagesContent = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    expect(messagesContent).toBe(
      "import frontendAppAuthnMessages from './messages/@openedx/frontend-app-authn';\n"
      + '\n'
      + 'export default [\n'
      + '  frontendAppAuthnMessages,\n'
      + '];\n',
    );
  });

  it('generates per-package index.ts and messages.ts for a basic structure', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': {
        'fr.json': { hello: 'bonjour', world: 'monde' },
        'es_419.json': { hello: 'hola', world: 'mundo' },
      },
    });

    prepare({ siteRoot: tmp.path });

    const authnIndex = readFile(path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'frontend-app-authn', 'index.ts'));
    // import block
    expect(authnIndex).toContain("import fr from './fr.json';");
    expect(authnIndex).toContain("import es_419 from './es_419.json';");
    // export block
    expect(authnIndex).toContain("'fr': fr,");
    expect(authnIndex).toContain("'es-419': es_419,");

    const messagesContent = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    // import block
    expect(messagesContent).toContain("import frontendAppAuthnMessages from './messages/@openedx/frontend-app-authn';");
    // export block
    expect(messagesContent).toContain('frontendAppAuthnMessages,');
  });

  it('skips empty JSON files when generating index.ts', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': {
        'fr.json': { hello: 'bonjour', world: 'monde' },
        'es_419.json': {}, // empty — should be skipped
      },
    });

    prepare({ siteRoot: tmp.path });

    const authnIndex = readFile(path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'frontend-app-authn', 'index.ts'));
    expect(authnIndex).toContain('fr');
    expect(authnIndex).not.toContain('es_419');
  });

  it('does not include a package that has no JSON files', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': { 'fr.json': { hello: 'bonjour' } },
      '@openedx/frontend-app-learning': {},
    });

    prepare({ siteRoot: tmp.path });

    const messagesContent = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    expect(messagesContent).toContain('frontendAppAuthnMessages');
    expect(messagesContent).not.toContain('frontendAppLearningMessages');
  });

  it('normalizes locale codes: es_419 filename uses es_419 var but es-419 key', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': {
        'es_419.json': { hello: 'hola', world: 'mundo' },
      },
    });

    prepare({ siteRoot: tmp.path });

    const authnIndex = readFile(path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'frontend-app-authn', 'index.ts'));
    expect(authnIndex).toContain("'es-419': es_419,");
    expect(authnIndex).not.toContain("'es_419':");
  });

  it('generates messages.ts with empty array when no messages dir and no site-messages exist', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);

    prepare({ siteRoot: tmp.path });

    const messagesContent = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    expect(messagesContent).toBe('export default [];\n');
  });

  it('generates messages.ts with empty array when messages dir exists but has no packages', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    fs.mkdirSync(path.join(tmp.path, 'src', 'i18n', 'messages'), { recursive: true });

    prepare({ siteRoot: tmp.path });

    const messagesContent = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    expect(messagesContent).toBe('export default [];\n');
  });

  it('includes site-messages last when both messages and site-messages are present', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': { 'ar.json': { key: 'val' } },
    });
    setupSiteMessages(tmp.path, { 'ar.json': { key: 'override' } });

    prepare({ siteRoot: tmp.path });

    const lines = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts')).trimEnd().split('\n');
    expect(lines.at(-1)).toBe('];');
    expect(lines.at(-2)).toBe('  siteMessages,');
  });

  it('generates messages.ts with only siteMessages when no messages dir exists', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupSiteMessages(tmp.path, { 'ar.json': { key: 'val' } });

    prepare({ siteRoot: tmp.path });

    const content = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    expect(content).toContain("import siteMessages from './site-messages';");
    expect(content).not.toContain('./messages/');
  });

  it('does not include site-messages when it has no JSON files', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': { 'ar.json': { key: 'val' } },
    });
    const siteMessagesDir = path.join(tmp.path, 'src', 'i18n', 'site-messages');
    fs.mkdirSync(siteMessagesDir, { recursive: true });
    fs.writeFileSync(path.join(siteMessagesDir, 'readme.txt'), 'ignore me', { encoding: 'utf8' });

    prepare({ siteRoot: tmp.path });

    const content = readFile(path.join(tmp.path, 'src', 'i18n', 'messages.ts'));
    expect(content).not.toContain('siteMessages');
  });

  it('never writes to src/i18n/index.ts', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': { 'ar.json': { key: 'val' } },
    });
    setupSiteMessages(tmp.path, { 'ar.json': { key: 'override' } });

    prepare({ siteRoot: tmp.path });

    expect(fs.existsSync(path.join(tmp.path, 'src', 'i18n', 'index.ts'))).toBe(false);
  });

  it('ignores non-JSON files in package directories', () => {
    using tmp = fs.mkdtempDisposableSync(tmpPrefix);
    setupI18nMessages(tmp.path, {
      '@openedx/frontend-app-authn': { 'ar.json': { key: 'val' } },
    });
    fs.writeFileSync(
      path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'frontend-app-authn', 'readme.txt'),
      'should be ignored',
      { encoding: 'utf8' },
    );

    prepare({ siteRoot: tmp.path });

    const authnIndex = readFile(path.join(tmp.path, 'src', 'i18n', 'messages', '@openedx', 'frontend-app-authn', 'index.ts'));
    expect(authnIndex).not.toContain('readme');
    expect(authnIndex).toContain('ar');
  });
});
