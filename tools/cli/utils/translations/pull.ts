import fs from 'fs';
import path from 'path';
import { prepare } from './prepare';

interface PackageTranslationsConfig {
  name?: string;
  atlasTranslations?: {
    path?: string;
    dependencies?: string[];
  };
}

interface ResolvedMapping {
  from: string, // atlas FROM path
  to: string, // full package name (TO)
}

function validateSiteTranslationsConfig(siteRoot: string): void {
  const pkgJsonPath = path.join(siteRoot, 'package.json');
  let config: PackageTranslationsConfig;
  try {
    config = JSON.parse(fs.readFileSync(pkgJsonPath, { encoding: 'utf8' }));
  } catch {
    throw new Error(`translations:pull: Could not read ${pkgJsonPath}`);
  }

  if (!config.atlasTranslations) {
    throw new Error(
      `translations:pull: No atlasTranslations field in ${pkgJsonPath}. `
      + 'Add an atlasTranslations config to enable translation pulling.',
    );
  }

  if (config.atlasTranslations.path && !config.name) {
    throw new Error(
      `translations:pull: atlasTranslations.path is set in ${pkgJsonPath} but there is no name field. `
      + 'A name field is required to identify this package as a translation source.',
    );
  }
}

function readTranslationsConfig(pkgJsonPath: string, nodeModulesBase: string): {
  packageName: string,
  config: PackageTranslationsConfig,
} | null {
  const packageName = path.relative(nodeModulesBase, path.dirname(pkgJsonPath));

  if (!fs.existsSync(pkgJsonPath)) {
    console.warn(`translations:pull: Package ${packageName} not found in node_modules, skipping.`);
    return null;
  }

  let config: PackageTranslationsConfig;
  try {
    config = JSON.parse(fs.readFileSync(pkgJsonPath, { encoding: 'utf8' }));
  } catch {
    console.warn(`translations:pull: Error reading package.json for ${packageName}, skipping.`);
    return null;
  }

  const resolvedPackageName = config.name ?? packageName;

  if (!config.atlasTranslations) {
    console.warn(`translations:pull: No atlasTranslations config in ${resolvedPackageName}, skipping.`);
    return null;
  }

  return { packageName: resolvedPackageName, config };
}

function resolveTranslationMappings(pkgJsonPath: string, nodeModulesBase: string): ResolvedMapping[] {
  const visited = new Set<string>();

  function resolve(pkgJsonPath: string, ancestors: string[]): ResolvedMapping[] {
    const read = readTranslationsConfig(pkgJsonPath, nodeModulesBase);
    if (!read) return [];

    const { packageName, config } = read;

    if (ancestors.includes(packageName)) {
      console.warn(`translations:pull: Circular dependency detected: ${[...ancestors, packageName].join(' → ')}, skipping.`);
      return [];
    }

    if (visited.has(packageName)) {
      return [];
    }

    visited.add(packageName);
    const results: ResolvedMapping[] = [];

    const mapping: ResolvedMapping | null = config.atlasTranslations?.path
      ? { from: config.atlasTranslations.path, to: packageName }
      : null;
    
    if (mapping) {
      results.push(mapping);
    }

    const dependencies: string[] = config.atlasTranslations?.dependencies ?? [];
    for (const dep of dependencies) {
      results.push(...resolve(path.join(nodeModulesBase, dep, 'package.json'), [...ancestors, packageName]));
    }

    return results;
  }

  return resolve(pkgJsonPath, []);
}

function clearMessages(messagesDir: string): void {
  if (fs.existsSync(messagesDir)) {
    fs.rmSync(messagesDir, { recursive: true });
  }
  fs.mkdirSync(messagesDir, { recursive: true });
}

export function pull({
  siteRoot,
  execSync,
  shouldPrepare,
  atlasOptions = '',
}: {
  siteRoot: string,
  execSync: (command: string) => void,
  shouldPrepare: boolean,
  atlasOptions?: string,
}): void {
  validateSiteTranslationsConfig(siteRoot);

  // only interact with messages dir, not site-messages
  const messagesDir = path.join(siteRoot, 'src', 'i18n', 'messages');
  const nodeModulesBase = path.join(siteRoot, 'node_modules');

  clearMessages(messagesDir);

  const mappings = resolveTranslationMappings(
    path.join(siteRoot, 'package.json'),
    nodeModulesBase,
  );

  if (!mappings.length) {
    if (shouldPrepare) prepare({ siteRoot });
    return;
  }

  const atlasMappings = mappings.map(m => `${m.from}:src/i18n/messages/${m.to}`).join(' ');
  execSync(`atlas pull ${atlasOptions} ${atlasMappings}`);
  if (shouldPrepare) prepare({ siteRoot });
}
