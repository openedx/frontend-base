import fs from 'fs';
import path from 'path';
import { Chunk } from 'webpack';
import { ParagonThemeCss, ParagonThemeUrlsFile } from '../types';

/**
 * Retrieves the name of the brand package from the given directory.
 *
 * @param {string} dir - The directory path containing the package.json file.
 * @return {string} The name of the brand package, or an empty string if not found.
 */
function getBrandPackageName(dir: string) {
  const appDependencies = JSON.parse(fs.readFileSync(path.resolve(dir, 'package.json'), 'utf-8')).dependencies;
  return Object.keys(appDependencies).find((key) => key.match(/@(open)?edx\/brand/)) || '';
}

/**
 * Attempts to extract the Paragon version from the `node_modules` of
 * the consuming application.
 *
 * @param {string} dir Path to directory containing `node_modules`.
 * @returns {string} Paragon dependency version of the consuming application
 */
export function getParagonVersion(dir: string, { isBrandOverride = false } = {}) {
  const npmPackageName = isBrandOverride ? getBrandPackageName(dir) : '@openedx/paragon';
  const pathToPackageJson = `${dir}/node_modules/${npmPackageName}/package.json`;
  if (!fs.existsSync(pathToPackageJson)) {
    return undefined;
  }
  return JSON.parse(fs.readFileSync(pathToPackageJson, 'utf-8')).version;
}

/**
 * Attempts to extract the Paragon theme CSS from the locally installed `@openedx/paragon` package.
 * @param {string} dir Path to directory containing `node_modules`.
 * @param {boolean} isBrandOverride
 * @returns {ParagonThemeCss}
 */
export function getParagonThemeCss(dir: string, { isBrandOverride = false } = {}): ParagonThemeCss | undefined {
  const npmPackageName = isBrandOverride ? getBrandPackageName(dir) : '@openedx/paragon';
  const pathToParagonThemeOutput = path.resolve(dir, 'node_modules', npmPackageName, 'dist', 'theme-urls.json');

  if (!fs.existsSync(pathToParagonThemeOutput)) {
    return undefined;
  }
  const paragonConfig: ParagonThemeUrlsFile = JSON.parse(fs.readFileSync(pathToParagonThemeOutput, 'utf-8'));
  const {
    core: themeCore,
    variants: themeVariants,
    defaults,
  } = paragonConfig?.themeUrls || {};

  const pathToCoreCss = path.resolve(dir, 'node_modules', npmPackageName, 'dist', themeCore.paths.minified);
  const coreCssExists = fs.existsSync(pathToCoreCss);

  const themeVariantResults = Object.entries(themeVariants || {}).reduce((themeVariantAcc, [themeVariant, value]) => {
    const themeVariantCssDefault = path.resolve(dir, 'node_modules', npmPackageName, 'dist', value.paths.default);
    const themeVariantCssMinified = path.resolve(dir, 'node_modules', npmPackageName, 'dist', value.paths.minified);

    if (!fs.existsSync(themeVariantCssDefault) && !fs.existsSync(themeVariantCssMinified)) {
      return themeVariantAcc;
    }

    return ({
      ...themeVariantAcc,
      [themeVariant]: {
        filePath: themeVariantCssMinified,
        entryName: isBrandOverride ? `brand.theme.variants.${themeVariant}` : `paragon.theme.variants.${themeVariant}`,
        outputChunkName: isBrandOverride ? `brand-theme-variants-${themeVariant}` : `paragon-theme-variants-${themeVariant}`,
      },
    });
  }, {});

  if (!coreCssExists || Object.keys(themeVariantResults).length === 0) {
    return undefined;
  }

  const coreResult = {
    filePath: path.resolve(dir, pathToCoreCss),
    entryName: isBrandOverride ? 'brand.theme.core' : 'paragon.theme.core',
    outputChunkName: isBrandOverride ? 'brand-theme-core' : 'paragon-theme-core',
  };

  return {
    core: fs.existsSync(pathToCoreCss) ? coreResult : undefined,
    variants: themeVariantResults,
    defaults,
  };
}

/**
 * @typedef CacheGroup
 * @property {string} type The type of cache group.
 * @property {string|function} name The name of the cache group.
 * @property {function} chunks A function that returns true if the chunk should be included in the cache group.
 * @property {boolean} enforce If true, this cache group will be created even if it conflicts with default cache groups.
 */

/**
 * @param {ParagonThemeCss} paragonThemeCss The Paragon theme CSS metadata.
 * @returns {Object.<string, CacheGroup>} The cache groups for the Paragon theme CSS.
 */
export function getParagonCacheGroups(paragonThemeCss: ParagonThemeCss | undefined) {
  if (!paragonThemeCss) {
    return {};
  }
  const cacheGroups: { [index: string]: { type: string, name: string, chunks: (chunk: Chunk) => boolean, enforce: boolean } } = {};

  if (paragonThemeCss.core !== undefined) {
    const { core } = paragonThemeCss;
    cacheGroups[paragonThemeCss.core.outputChunkName] = {
      type: 'css/mini-extract',
      name: paragonThemeCss.core.outputChunkName,
      chunks: (chunk: Chunk) => chunk.name === core.entryName,
      enforce: true,
    };
  }

  Object.values(paragonThemeCss.variants).forEach(({ entryName, outputChunkName }) => {
    cacheGroups[outputChunkName] = {
      type: 'css/mini-extract',
      name: outputChunkName,
      chunks: (chunk: Chunk) => chunk.name === entryName,
      enforce: true,
    };
  });
  return cacheGroups;
}

/**
 * @param {ParagonThemeCss} paragonThemeCss The Paragon theme CSS metadata.
 * @returns {Object.<string, string>} The entry points for the Paragon theme CSS. Example: ```
 * {
 *   "paragon.theme.core": "/path/to/node_modules/@openedx/paragon/dist/core.min.css",
 *   "paragon.theme.variants.light": "/path/to/node_modules/@openedx/paragon/dist/light.min.css"
 * }
 * ```
 */
export function getParagonEntryPoints(paragonThemeCss: ParagonThemeCss | undefined) {
  if (!paragonThemeCss) {
    return {};
  }

  const entryPoints: { [entryName: string]: string } = {};
  if (paragonThemeCss.core !== undefined) {
    entryPoints[paragonThemeCss.core.entryName] = path.resolve(process.cwd(), paragonThemeCss.core.filePath);
  }
  Object.values(paragonThemeCss.variants).forEach(({ filePath, entryName }) => {
    entryPoints[entryName] = path.resolve(process.cwd(), filePath);
  });
  return entryPoints;
}
