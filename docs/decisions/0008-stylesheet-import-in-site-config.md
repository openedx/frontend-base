# Shell stylesheet must be imported in site.config file.

## Summary

A project must import the stylesheet for the application shell in its site.config file.

## Context

There is a particular quirk of the stylesheet loaders for webpack (style-loader and/or css-loader) where the import of stylesheets into JavaScript files must take place in a JS file in the project, not in library dependency like frontend-base.  Further, the stylesheet imported into JS must _itself_ be a part of the project.

If, for instance, we try to import a stylesheet from frontend-base (shell, header, footer, etc.) inside a React component inside the shell, webpack silently ignores the import and refuses to load the stylesheet.  If we try to import a stylesheet from frontend-base directly into the site.config file in the project, that will also fail with webpack silently ignoring the stylesheet. If, however, frontend-base exports the stylesheet and it's loaded into a SCSS file in the project and _that_ is imported into site.config, everything works correctly.

This slight indirection through a SCSS file in the project is necessary, and arguably desirable.  It ensure as common, unified entry point for SCSS from dependencies of the project.  SCSS from the project or micro-frontend itself can be imported into its own components, or can be imported into this top-level SCSS file as desired.  Further, this ensures that every aspect of the style of a project or MFE can easily be customized since the stylesheet is supplied through the site.config file.

## Decision

As a best practice, a project should have a top-level SCSS file as a peer to the site.config file.  This SCSS file should import the stylesheet from the frontend-base shell application.  It should, in turn, be imported into the site.config file.

## Implementation

The `project.scss` file should import the stylesheet from the shell:

```diff
+ @import '@openedx/frontend-base/shell/app.scss';

// other styles
```

The site.config file should then import the top-level SCSS file:

```diff
+ import './project.scss';

const config = {
  // config document
}

export default config;
```
