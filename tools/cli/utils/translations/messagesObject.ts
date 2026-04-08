import fs from 'fs';
import path from 'path';

export interface LocaleImport {
  localeName: string, // e.g. 'es_419'
  filename: string, // e.g. 'es_419.json'
}

export interface LocaleEntry {
  key: string, // e.g. 'es-419'
  varName: string, // e.g. 'es_419'
}

export interface MessagesObject {
  imports: LocaleImport[],
  entries: LocaleEntry[],
}

/**
 * Reads all locale JSON files in a directory and returns the data needed to
 * render a messages object ({ 'ar': ar, 'es-419': es_419 }).
 * Returns null if no non-empty JSON files are found.
 */
export function generateMessagesObject(dirPath: string): MessagesObject | null {
  const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true });
  const jsonFiles = dirEntries
    .filter(e => e.isFile() && e.name.endsWith('.json'))
    .map(e => e.name);

  const imports: LocaleImport[] = [];
  const entries: LocaleEntry[] = [];

  for (const filename of jsonFiles) {
    const localeName = filename.replace(/\.json$/, '');
    const key = localeName.toLowerCase().replace(/_/g, '-');
    const filePath = path.join(dirPath, filename);

    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
      if (!Object.keys(parsed).length) {
        continue; // skip empty files
      }
    } catch {
      continue;
    }

    imports.push({ localeName, filename });
    entries.push({ key, varName: localeName });
  }

  if (!imports.length) {
    return null;
  }

  return { imports, entries };
}

export function renderImportLine({ localeName, filename }: LocaleImport): string {
  return `import ${localeName} from './${filename}';`;
}

export function renderImportsBlock(messagesObject: MessagesObject): string {
  return messagesObject.imports.map(renderImportLine).join('\n');
}

export function renderExportLine({ key, varName }: LocaleEntry): string {
  return `  '${key}': ${varName},`;
}

export function renderExportBlock(messagesObject: MessagesObject): string {
  const lines = messagesObject.entries.map(renderExportLine).join('\n');
  return `export default {\n${lines}\n};\n`;
}

/**
 * Renders a MessagesObject and writes it to an index.ts file in the given directory.
 */
export function writeMessagesObjectToFile(
  dirPath: string,
  messagesObject: MessagesObject,
): void {
  const content = `${renderImportsBlock(messagesObject)}\n\n${renderExportBlock(messagesObject)}`;
  fs.writeFileSync(path.join(dirPath, 'index.ts'), content);
}
