import fs from 'fs';
import camelCase from 'lodash.camelcase';
import path from 'path';
import { generateMessagesObject, writeMessagesObjectToFile, type MessagesObject } from './messagesObject';

function packageVarName(packagePath: string): string {
  const name = packagePath.split('/').pop()!;
  return `${camelCase(name)}Messages`;
}

function getPackageMessages(messagesDir: string, packagePath: string): MessagesObject | null {
  return generateMessagesObject(path.join(messagesDir, packagePath));
}

function getPackagePaths(messagesDir: string): string[] {
  const directoryEntries = fs.readdirSync(messagesDir, { withFileTypes: true })
    .filter(e => e.isDirectory());

  const packagePaths: string[] = [];
  for (const entry of directoryEntries) {
    const directory = fs.readdirSync(path.join(messagesDir, entry.name), { withFileTypes: true });
    if (!directory.some(e => e.isDirectory())) {
      // no subdirectories, this is a package dir
      packagePaths.push(entry.name);
      continue;
    }

    // this is a scope dir, subdirs are packages
    const packageDirs = directory.filter(e => e.isDirectory());
    for (const pkg of packageDirs) {
      packagePaths.push(`${entry.name}/${pkg.name}`);
    }
  }

  return packagePaths;
}

function getAllPackageMessages(messagesDir: string): Map<string, MessagesObject> {
  if (!fs.existsSync(messagesDir)) {
    // directory doesn't exist
    return new Map();
  }

  const directory = fs.readdirSync(messagesDir, { withFileTypes: true });
  if (!directory.some(e => e.isDirectory())) {
    // directory exists but has no subdirectories
    return new Map();
  }

  const packagePaths = getPackagePaths(messagesDir);
  const result = new Map<string, MessagesObject>();
  for (const packagePath of packagePaths) {
    const messagesObject = getPackageMessages(messagesDir, packagePath);
    if (messagesObject) {
      result.set(packagePath, messagesObject);
    }
  }
  return result;
}

export function prepareAllPackageMessages(messagesDir: string): [string[], string[]] {
  const packageMessages = getAllPackageMessages(messagesDir);

  const importLines: string[] = [];
  const exportItems: string[] = [];

  for (const [packagePath, messagesObject] of packageMessages) {
    writeMessagesObjectToFile(path.join(messagesDir, packagePath), messagesObject);
    const varName = packageVarName(packagePath);
    importLines.push(`import ${varName} from './messages/${packagePath}';`);
    exportItems.push(`  ${varName},`);
  }

  return [importLines, exportItems];
}

export function prepareSiteMessages(siteMessagesDir: string): [string[], string[]] {
  const siteMessages = fs.existsSync(siteMessagesDir)
    ? generateMessagesObject(siteMessagesDir)
    : null;

  if (!siteMessages) {
    return [[], []];
  }

  writeMessagesObjectToFile(siteMessagesDir, siteMessages);
  return [
    [`import siteMessages from './site-messages';`],
    [`  siteMessages,`],
  ];
}

export function prepare({ siteRoot }: { siteRoot: string }): void {
  const i18nDir = path.join(siteRoot, 'src', 'i18n');
  const messagesDir = path.join(i18nDir, 'messages');
  const siteMessagesDir = path.join(i18nDir, 'site-messages');

  const [packageImportLines, packageExportItems] = prepareAllPackageMessages(messagesDir);
  const [siteImportLines, siteExportItems] = prepareSiteMessages(siteMessagesDir);

  const importLines = [...packageImportLines, ...siteImportLines];
  const exportItems = [...packageExportItems, ...siteExportItems];

  const hasMessages = importLines.length > 0 && exportItems.length > 0;
  const messagesContent = hasMessages
    ? `${importLines.join('\n')}\n\nexport default [\n${exportItems.join('\n')}\n];\n`
    : 'export default [];\n';

  fs.mkdirSync(i18nDir, { recursive: true });
  fs.writeFileSync(path.join(i18nDir, 'messages.ts'), messagesContent);
}
