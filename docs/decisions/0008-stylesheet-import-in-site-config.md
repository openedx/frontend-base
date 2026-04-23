# Shell style manifest must be imported in site.config file.

## Summary

A site must import the shell's style manifest (`@openedx/frontend-base/shell/style`) from its site.config file.

## Context

A composing site needs a single, project-owned entry point for its global CSS. Two concerns drive this:

1. **CSS ownership.** Paragon's base CSS declares CSS custom properties on `:root`. If a lazy-loaded app chunk ships its own copy of Paragon's base CSS, its `:root` declarations run after the site's brand overrides and clobber them globally. The composing site must therefore be the **single owner** of shell, Paragon base, and brand CSS; apps must not re-bundle these. Having the site import the shell's style manifest from its site.config makes this ownership explicit and keeps the rule easy to audit.

2. **Layer classification by resource path.** The build pipeline wraps each stylesheet in a CSS cascade layer based on where it was resolved from. For that to classify Paragon's base CSS into the `shell` layer rather than the layer of whichever SCSS file happened to `@use` it, each import must be its own webpack module. The shell's style manifest is a small TS file that imports Paragon's CSS and the shell's own SCSS side by side, so every entry is seen by webpack as an independent compilation unit and classified on its own merits.

3. **PostCSS-pass scoping.** Paragon exposes responsive breakpoints as `@custom-media` declarations, substituted at build time by `postcss-custom-media`. Substitution only works if the declarations are visible to the same PostCSS pass as the `@media` rule that references them. The shell manifest pulls Paragon's core CSS into the site's build, so any `@media (--pgn-size-breakpoint-*)` reference in a site-level stylesheet resolves correctly. App stylesheets are separate PostCSS passes and handle this themselves; see [the theming guide](../how_tos/theming.md#custom-media-breakpoints) for details.

An earlier version of this ADR claimed that webpack's stylesheet loaders silently ignore imports sourced from library dependencies. That is no longer accurate with the current loader configuration (see `tools/webpack/common-config/all/getStylesheetRule.ts`). Importing the manifest from site.config remains the correct pattern, but for the ownership, classification, and scoping reasons above rather than a loader quirk.

## Decision

A project's site.config file must import the shell's style manifest (`@openedx/frontend-base/shell/style`). If the site has additional global styles, it can import its own SCSS file from site.config alongside (or in place of) a brand package.

The shell manifest must be imported **only once**, by the composing site.  Apps that are consumed by a site must not import the manifest (or any other source of Paragon base styles) from their runtime code, because doing so causes lazy-loaded app chunks to re-declare Paragon's `:root` CSS custom properties and clobber the site's brand overrides globally.  Apps may still import the manifest from `site.config.dev.tsx` (not shipped in `dist/`) so that they render correctly when run standalone.  See [the theming guide](../how_tos/theming.md#css-ownership) and [the migration guide](../how_tos/migrate-frontend-app.md#separate-runtime-styles-from-the-dev-harness) for details.

## Cascade layers

The build pipeline wraps each stylesheet in a CSS cascade layer based on the resolved resource path:

| Layer     | Sources                                                           |
| --------- | ----------------------------------------------------------------- |
| `paragon` | `@openedx/paragon`                                                |
| `shell`   | `@openedx/frontend-base`                                          |
| `app`     | any other stylesheet resolved from `node_modules`                 |
| `site`    | stylesheets outside `node_modules` (the composing site's source)  |
| `brand`   | `@(open)?edx/brand*` packages                                     |

The order is declared in `shell/layer-order.scss` as `@layer paragon, shell, app, site, brand;`, so the cascade resolves in that order: `brand` wins over `site`, `site` wins over `app`, `app` wins over `shell`, and `shell` wins over `paragon`.

`brand` is last because, in production, brand CSS is injected at runtime via `<link>` tags that bypass webpack entirely and therefore land **unlayered**. Unlayered rules beat every layered rule regardless of declared order, so runtime brand wins over the site's own CSS. Putting build-time brand imports (e.g. a dev harness that `@use`s a brand package directly) in the last layer keeps dev harness behavior consistent with production: brand overrides apply on top of everything the site declares.

This is enforced by a PostCSS plugin (`tools/webpack/common-config/all/postcssWrapLayer.ts`) applied as the final step of the CSS pipeline. `@charset`, `@import`, `@use`, `@forward`, and existing `@layer` nodes are preserved at the root; everything else is moved into the layer block.

Apps must still follow the ownership rule above. The layering is a safety net: if an app chunk does re-ship Paragon's `:root` declarations, its `app`-layer block loses to the site's `site`-layer tokens and any brand overrides. Relying on the safety net rather than the ownership rule still wastes bytes on the wire.

## Implementation

The site.config file should import the shell's style manifest:

```diff
+ import '@openedx/frontend-base/shell/style';

const siteConfig = {
  // config document
}

export default siteConfig;
```

If the site has its own global styles, it can add an `@use` or `@import` of a local SCSS file after the manifest import.
