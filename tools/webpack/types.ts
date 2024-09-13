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
  variants: { [key: string] : ParagonThemeVariantCssAsset }
  defaults: {

  }
}

// This isn't perfect, as it implies having neither url nor urls would be valid.  Feel free to improve it so that one is required.
export type ParagonThemeUrlsVariant = {
  url?: string,
  urls?: {
    [urlName: string]: string | undefined,
  }
}

export interface ParagonThemeUrls {
  core: ParagonThemeUrlsVariant,
  defaults: {
    [variantName: string]: string,
  },
  variants: {
    [variantName: string]: ParagonThemeUrlsVariant
  }
}

export interface ParagonThemeUrlsFile {
  themeUrls: {
    core: {
      paths: {
        default: string,
        minified: string,
      }
    },
    defaults: {
      [variant: string]: string,
    },
    variants: {
      [variant: string]: {
        paths: {
          default: string,
          minified: string,
        }
      }
    }
  }
}

export interface ParagonScriptContents {
  paragon?: {
    version: string,
    themeUrls: {
      core: any,
      variants: any,
      defaults: any,
    }
  },
  brand?: {
    version: string,
    themeUrls: {
      core: any,
      variants: any,
      defaults: any,
    }
  }
}
