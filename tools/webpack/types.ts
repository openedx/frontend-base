/**
 * The metadata about the core Paragon theme CSS
 */
export interface ParagonThemeCssAsset {
  filePath: string,
  entryName: string,
  outputChunkName: string,
}

export interface ParagonThemeVariantCssAsset {
  filePath: string,
  entryName: string,
  outputChunkName: string,
}

export interface ParagonThemeCss {
  core: ParagonThemeCssAsset | undefined,
  variants: Record<string, ParagonThemeVariantCssAsset>,
  defaults: object,
}

// This isn't perfect, as it implies having neither url nor urls would be valid.  Feel free to improve it so that one is required.
export type ParagonThemeUrlsVariant = {
  url?: string,
  urls?: Record<string, string | undefined>,
}

export interface ParagonThemeUrls {
  core: ParagonThemeUrlsVariant,
  defaults: Record<string, string>,
  variants: Record<string, ParagonThemeUrlsVariant>,
}

export interface ParagonThemeUrlsFile {
  themeUrls: {
    core: {
      paths: {
        default: string,
        minified: string,
      },
    },
    defaults: Record<string, string>,
    variants: Record<string, {
      paths: {
        default: string,
        minified: string,
      },
    }>,
  },
}

export interface ParagonScriptContents {
  paragon?: {
    version: string,
    themeUrls: {
      core: any,
      variants: any,
      defaults: any,
    },
  },
  brand?: {
    version: string,
    themeUrls: {
      core: any,
      variants: any,
      defaults: any,
    },
  },
}
