import fs from 'fs';
import path from 'path';
import { prepare } from './prepare';

interface ResolvedMapping {
  from: string, // atlas FROM path
  to: string, // full package name (TO)
}

function resolveTranslationMappings({
  packageName,
  ancestors,
  visited,
  nodeModulesBase,
}: {
  packageName: string,
  ancestors: string[],
  visited: Set<string>,
  nodeModulesBase: string,
}): ResolvedMapping[] {
  if (ancestors.includes(packageName)) {
    console.warn(`translations:pull: Circular dependency detected: ${[...ancestors, packageName].join(' → ')}, skipping.`);
    return [];
  }

  if (visited.has(packageName)) {
    return [];
  }

  const pkgJsonPath = path.join(nodeModulesBase, packageName, 'package.json');

  if (!fs.existsSync(pkgJsonPath)) {
    console.warn(`translations:pull: Package ${packageName} not found in node_modules, skipping.`);
    return [];
  }

  let atlasTranslations: { path?: string, dependencies?: string[] } | undefined;
  try {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, { encoding: 'utf8' }));
    atlasTranslations = pkgJson.atlasTranslations;
  } catch {
    console.warn(`translations:pull: Error reading package.json for ${packageName}, skipping.`);
    return [];
  }

  if (!atlasTranslations) {
    console.warn(`translations:pull: No atlasTranslations config in ${packageName}, skipping.`);
    return [];
  }

  visited.add(packageName);
  const results: ResolvedMapping[] = [];

  if (atlasTranslations.path) {
    results.push({ from: atlasTranslations.path, to: packageName });
  }

  for (const dep of (atlasTranslations.dependencies ?? [])) {
    results.push(...resolveTranslationMappings({
      packageName: dep,
      ancestors: [...ancestors, packageName],
      visited,
      nodeModulesBase,
    }));
  }

  return results;
}

function resolveAllTranslationMappings({
  dependencies,
  nodeModulesBase,
}: {
  dependencies: string[],
  nodeModulesBase: string,
}): ResolvedMapping[] {
  const visited = new Set<string>();
  const mappings: ResolvedMapping[] = [];

  for (const dep of dependencies) {
    mappings.push(...resolveTranslationMappings({
      packageName: dep,
      ancestors: [],
      visited,
      nodeModulesBase,
    }));
  }

  return mappings;
}

function getSiteDependencies(siteRoot: string): string[] {
  let sitePkgJson: { atlasTranslations?: { dependencies?: string[] } };
  try {
    sitePkgJson = JSON.parse(fs.readFileSync(path.join(siteRoot, 'package.json'), { encoding: 'utf8' }));
  } catch {
    throw new Error(`translations:pull: Could not read ${path.join(siteRoot, 'package.json')}`);
  }

  if (!sitePkgJson.atlasTranslations) {
    throw new Error(
      'translations:pull: No atlasTranslations field in package.json. '
      + 'Add an atlasTranslations config with dependencies to enable translation pulling.',
    );
  }

  return sitePkgJson.atlasTranslations.dependencies ?? [];
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
  const dependencies = getSiteDependencies(siteRoot);

  // only interact with messages dir, not site-messages
  const messagesDir = path.join(siteRoot, 'src', 'i18n', 'messages');

  // no deps, nothing to pull
  if (!dependencies.length) {
    clearMessages(messagesDir);
    if (shouldPrepare) prepare({ siteRoot });
    return;
  }

  const nodeModulesBase = path.join(siteRoot, 'node_modules');
  const mappings = resolveAllTranslationMappings({
    dependencies,
    nodeModulesBase,
  });

  // no resolved deps, can't pull anything
  if (!mappings.length) {
    clearMessages(messagesDir);
    if (shouldPrepare) prepare({ siteRoot });
    return;
  }

  clearMessages(messagesDir);
  const atlasMappings = mappings.map(m => `${m.from}:${m.to}`).join(' ');
  execSync(`atlas pull ${atlasOptions} ${atlasMappings}`);
  if (shouldPrepare) prepare({ siteRoot });
}
