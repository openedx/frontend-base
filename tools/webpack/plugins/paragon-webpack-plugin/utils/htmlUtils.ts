import { Compilation, sources } from 'webpack';

import { getCssAssetsFromCompilation } from './assetUtils';
import { generateScriptContents, insertScriptContentsIntoDocument } from './scriptUtils';

/**
 * Injects metadata into the HTML document by modifying the 'index.html' asset in the compilation.
 *
 * @param {Object} compilation - The Webpack compilation object.
 * @param {Object} options - The options object.
 * @param {Object} options.paragonThemeCss - The Paragon theme CSS object.
 * @param {string} options.paragonVersion - The version of the Paragon theme.
 * @param {Object} options.brandThemeCss - The brand theme CSS object.
 * @param {string} options.brandVersion - The version of the brand theme.
 * @return {Object|undefined} The script contents object if the 'index.html' asset exists, otherwise undefined.
 */
export function injectMetadataIntoDocument(compilation: Compilation, {
  paragonThemeCss,
  paragonVersion,
  brandThemeCss,
  brandVersion,
}: {
  paragonThemeCss: any,
  paragonVersion: string,
  brandThemeCss: any,
  brandVersion: string,
}) {
  const file = compilation.getAsset('index.html');
  if (!file) {
    return undefined;
  }
  const {
    coreCssAsset: paragonCoreCssAsset,
    themeVariantCssAssets: paragonThemeVariantCssAssets,
  } = getCssAssetsFromCompilation(compilation, {
    brandThemeCss,
    paragonThemeCss,
  });
  const {
    coreCssAsset: brandCoreCssAsset,
    themeVariantCssAssets: brandThemeVariantCssAssets,
  } = getCssAssetsFromCompilation(compilation, {
    isBrandOverride: true,
    brandThemeCss,
    paragonThemeCss,
  });

  const scriptContents = generateScriptContents({
    paragonCoreCssAsset,
    paragonThemeVariantCssAssets,
    brandCoreCssAsset,
    brandThemeVariantCssAssets,
    paragonThemeCss,
    paragonVersion,
    brandThemeCss,
    brandVersion,
  });

  // We expect this to be a string at all times.
  const originalSource = file.source.source() as string;
  const newSource = insertScriptContentsIntoDocument({
    originalSource,
    // @ts-expect-error This parameter doesn't exist in the function.
    coreCssAsset: paragonCoreCssAsset,
    themeVariantCssAssets: paragonThemeVariantCssAssets,
    scriptContents,
  });

  compilation.updateAsset('index.html', new sources.RawSource(newSource.source()));

  return scriptContents;
}
