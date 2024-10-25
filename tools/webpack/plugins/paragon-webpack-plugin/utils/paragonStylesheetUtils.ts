import { sources } from 'webpack';
import { ParagonThemeUrls } from '../../../types';
import { insertStylesheetsIntoDocument } from './stylesheetUtils';
import { handleVersionSubstitution } from './tagUtils';

/**
 * Injects Paragon core stylesheets into the document.
 *
 * @param {Object} options - The options object.
 * @param {string|object} options.source - The source HTML document.
 * @param {Object} options.paragonCoreCss - The Paragon core CSS object.
 * @param {Object} options.paragonThemeCss - The Paragon theme CSS object.
 * @param {Object} options.brandThemeCss - The brand theme CSS object.
 * @return {string|object} The modified HTML document with Paragon core stylesheets injected.
 */
export function injectParagonCoreStylesheets({
  source,
  paragonCoreCss,
  paragonThemeCss,
  brandThemeCss,
}: {
  source: string,
  paragonCoreCss: any,
  paragonThemeCss: any,
  brandThemeCss: any,
}) {
  return insertStylesheetsIntoDocument({
    source,
    urls: paragonCoreCss.urls,
    // @ts-expect-error These two parameters don't exist on insertStylesheetsIntoDocument
    paragonThemeCss,
    brandThemeCss,
  });
}

/**
 * Injects Paragon theme variant stylesheets into the document.
 *
 * @param {Object} options - The options object.
 * @param {string|object} options.source - The source HTML document.
 * @param {Object} options.paragonThemeVariantCss - The Paragon theme variant CSS object.
 * @param {Object} options.paragonThemeCss - The Paragon theme CSS object.
 * @param {Object} options.brandThemeCss - The brand theme CSS object.
 * @return {string|object} The modified HTML document with Paragon theme variant stylesheets injected.
 */
export function injectParagonThemeVariantStylesheets({
  source,
  paragonThemeVariantCss,
  paragonThemeCss,
  brandThemeCss,
}: { source: sources.ReplaceSource | undefined, paragonThemeVariantCss: any, paragonThemeCss: any, brandThemeCss: any }) {
  let newSource: sources.ReplaceSource | undefined = source;
  Object.values(paragonThemeVariantCss).forEach(({ urls }: any) => {
    newSource = insertStylesheetsIntoDocument({
      source: (typeof newSource === 'object' ? newSource.source() : newSource) as string,
      urls,
      // @ts-expect-error These two parameters don't exist on insertStylesheetsIntoDocument
      paragonThemeCss,
      brandThemeCss,
    });
  });
  return newSource;
}
/**
 * Retrieves the URLs of the Paragon stylesheets based on the provided theme URLs, Paragon version, and brand version.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.paragonThemeUrls - The URLs of the Paragon theme.
 * @param {string} options.paragonVersion - The version of the Paragon theme.
 * @param {string} options.brandVersion - The version of the brand theme.
 * @return {Object} An object containing the URLs of the Paragon stylesheets.
 */
export function getParagonStylesheetUrls({ paragonThemeUrls, paragonVersion, brandVersion }: { paragonThemeUrls: ParagonThemeUrls, paragonVersion: string, brandVersion: string }): ParagonThemeUrls {
  const paragonCoreCssUrl = 'urls' in paragonThemeUrls.core && paragonThemeUrls.core.urls !== undefined ? paragonThemeUrls.core.urls.default : paragonThemeUrls.core.url;
  const brandCoreCssUrl = 'urls' in paragonThemeUrls.core && paragonThemeUrls.core.urls !== undefined ? paragonThemeUrls.core.urls.brandOverride : undefined;

  const defaultThemeVariants = paragonThemeUrls.defaults || {};

  const coreCss = {
    urls: {
      default: handleVersionSubstitution({
        url: paragonCoreCssUrl,
        wildcardKeyword: '$paragonVersion',
        localVersion: paragonVersion
      }),
      brandOverride: handleVersionSubstitution({
        url: brandCoreCssUrl,
        wildcardKeyword: '$brandVersion',
        localVersion: brandVersion
      }),
    },
  };

  const themeVariantsCss: any = {};
  const themeVariantsEntries = Object.entries(paragonThemeUrls.variants || {});
  themeVariantsEntries.forEach(([themeVariant, { url, urls }]) => {
    const themeVariantMetadata = { urls: {} };
    if (url) {
      themeVariantMetadata.urls = {
        default: handleVersionSubstitution({
          url,
          wildcardKeyword: '$paragonVersion',
          localVersion: paragonVersion,
        }),
        // If there is no brand override URL, then we don't need to do any version substitution
        // but we still need to return the property.
        brandOverride: undefined,
      };
    } else if (urls) {
      themeVariantMetadata.urls = {
        default: handleVersionSubstitution({
          url: urls.default,
          wildcardKeyword: '$paragonVersion',
          localVersion: paragonVersion,
        }),
        brandOverride: handleVersionSubstitution({
          url: urls.brandOverride,
          wildcardKeyword: '$brandVersion',
          localVersion: brandVersion,
        }),
      };
    }
    themeVariantsCss[themeVariant] = themeVariantMetadata;
  });

  return {
    core: coreCss,
    variants: themeVariantsCss,
    defaults: defaultThemeVariants,
  };
}
