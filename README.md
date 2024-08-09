# Open edX frontend framework

| :rotating_light: Pre-alpha                                                                |
|:------------------------------------------------------------------------------------------|
| frontend-base is under **active development** and may change significantly without warning. |

This library is a **future** replacement for many of the foundational libraries in the Open edX frontend.

Development of this library is part of a project to create a reference implementation for [OEP-65: Frontend Composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html).

It will replace:

- https://github.com/openedx/frontend-build
- https://github.com/openedx/frontend-platform
- https://github.com/openedx/frontend-plugin-framework
- https://github.com/openedx/frontend-component-header
- https://github.com/openedx/frontend-component-footer

The new frontend framework will completely take over responsibility for the functionality of those libraries, and will also include a "shell" application.

It will enable Open edX frontends to be loaded as "module plugins" via Webpack module federation, or as "direct plugins" as part of a single, unified application.   It will also support creation of "project" repositories as a central place to check in an Open edX instance's frontend customizations and extensions.

## Further reading

- [OEP-65: Frontend composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html)
- [ADR 0001: Create a unified platform library](https://github.com/openedx/open-edx-proposals/pull/598)
- [Discourse discussion on frontend projects](https://discuss.openedx.org/t/oep-65-adjacent-a-frontend-architecture-vision/13223)

## Communication

This project uses the [#module-federation](https://openedx.slack.com/archives/C06HRLTP3E0) channel in Open edX Slack.

You can follow ongoing progress on the project's [Github project board](https://github.com/orgs/openedx/projects/65/views/1).

Feel free to reach out to David Joy ([Github](https://github.com/davidjoy), [Slack](https://openedx.slack.com/team/UFM4FEN0J)) with any questions.

## Development

This library is not yet published to npm.

In the meantime, it can be used as a replacement for `openedx/frontend-build` in an Open edX micro-frontend in a few steps.

### 1. Clone this repository

  Clone this repository as a peer of your micro-frontend folder(s).

### 2. `npm install` and `npm run build` in frontend-base

You'll need to install dependencies and then build this repo at least once.  If you want the build process to watch for changes, you can do `npm run build:watch` instead.

### 3. Change dependencies in package.json in MFE

We need to:

- Uninstall `@edx/frontend-platform`
- Uninstall `@openedx/frontend-build`
- Add frontend-base to dependencies

```
npm uninstall @edx/frontend-platform @openedx/frontend-build
```

And then manually add `frontend-base` to package.json's dependencies:

```
"dependencies": {
+ "@openedx/frontend-base": "file:../frontend-base",
},
```

After doing these two steps, your package.json should have changed in this way:

```
"dependencies": {
+ "@openedx/frontend-base": "file:../frontend-base",
- "@edx/frontend-platform": "@edx/frontend-platform@<version>"
},
"devDependencies": {
- "@openedx/frontend-build": "@openedx/frontend-build@<version>"
}
```

This will let your MFE use the checked out version of `frontend-base`.

### 4. `npm install`in MFE

Just to be sure you don't run into any dependency skew issues, delete the MFE's `node_modules` and `package-lock.json`.  Then run `npm install` again to make sure we've fully cleaned out frontend-platform and frontend-build's downstream dependencies.  Historically, messing with frontend-build has caused big problems if you don't do this.

```
rm -rf node_modules
rm package-lock.json
npm install
```

### 5. Add frontend-base to module.config.js in MFE

To use a local version of frontend-base properly, you need to add it to module.config.js.  Add the following line to your module.config.js file in your MFE:

```diff
module.exports = {
  localModules: [
+   { moduleName: '@openedx/frontend-base', dir: '../frontend-base', dist: 'dist' },
  ],
};

```

### 6. Migrate your MFE

Follow the steps below to migrate an MFE to use frontend-base.

## Migrating to frontend-base (no shell)

### 1. Edit package.json `scripts`

Replace all instances of `fedx-scripts` with `openedx` in your package.json file.

> [!TIP]
> **Why change `fedx-scripts` to `openedx`?**
> A few reasons.  One, the Open edX project shouldn't be using the name of an internal community of practice at edX for its frontend tooling.  Two, some dependencies of your MFE invariably still use frontend-build for their own build needs.  This means that they already installed `fedx-scripts` into your `node_modules/.bin` folder.  Only one version can be in there, so we need a new name.  Seemed like a great time for a naming refresh. |

### 2. Add a Type Declaration file (app.d.ts)

Create an `app.d.ts` file in the root of your MFE with the following contents:

```
/// <reference types="@openedx/frontend-base" />

declare module "*.svg" {
  const content: string;
  export default content;
}
```

This will ensure that you can import SVG files, and have type declarations for the frontend-base library.

### 3. Add a tsconfig.json file

Create a tsconfig.json file and add the following contents to it:

```
{
  "extends": "@openedx/frontend-base/config/tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist"
  },
  "include": [
    ".eslintrc.js",
    "jest.config.js",
    "env.config.js",
    "src/**/*",
    "app.d.ts",
  ]
}
```

This assumes you have a `src` folder and your build goes in `dist`, which is the best practice.

### 4. Edit `jest.config.js`

Replace the import from 'frontend-build' with 'frontend-base'.

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

### 5. Edit `.eslintrc.js`

Replace the import from 'frontend-build' with 'frontend-base'.

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

### 6. Search for any other usages of `frontend-build`

Find any other imports/usages of `frontend-build` in your repository and replace them with `frontend-base` so they don't break.

### 7. i18n Descriptions

Description fields are now required on all i18n messages in the repository.  This is because of a change to the ESLint config.

### 8. Jest Mocks

Jest test suites that test React components that import SVG and files must add mocks for those filetypes.  This can be accomplished by adding the following module name mappers to jest.config.js:

```
moduleNameMapper: {
  '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/file.js',
},
```

Then, create a `src/__mocks__` folder and add the necessary mocks.

**svg.js:**

```
module.exports = 'SvgURL';
```

**file.js:**

```
module.exports = 'FileMock';
```

You can change the values of "SvgURL", and "FileMock" if you want to reduce changes necessary to your snapshot tests; the old values from frontend-build assume svg is only being used for icons, so the values referenced an "icon" which felt unnecessarily narrow.

This is necessary because we cannot write a tsconfig.json in MFEs that includes transpilation of the "tools/jest" folder in frontend-base, it can't meaningfully find those files and transpile them, and we wouldn't want all MFEs to have to include such idiosyncratic configuration anyway.  The SVG mock, however, requires ESModules syntax to export its default and ReactComponent exports at the same time.  This means without moving the mocks into the MFE code, the SVG one breaks transpilation and doesn't understand the `export` syntax used.  By moving them into the MFE, they can be easily transpiled along with all the other code when jest tries to run.

### 9. SVGR "ReactComponent" imports have been removed.

We have removed the `@svgr/webpack` loader because it was incompatible with more modern tooling (it requires Babel).  As a result, the ability to import SVG files into JS as the `ReactComponent` export no longer works.  We know of a total of 5 places where this is happening today in Open edX MFEs - frontend-app-learning and frontend-app-profile use it.  Please replace that export with the default URL export and set the URL as the source of an `<img>` tag, rather than using `ReactComponent`.  You can see an example of normal SVG imports in `test-app/src/App.jsx`.

### 10. Import `createConfig` and `getBaseConfig` from `@openedx/frontend-base/config`

In frontend-build, `createConfig` and `getBaseConfig` could be imported from the root package (`@openedx/frontend-build`).  They have been moved to a sub-directory to make room for runtime exports from the root package (`@openedx/frontend-base`).

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

You may have handled this in steps 4 and 5 above (jest.config.js and .eslintrc.js)

### 11. Replace all imports from `@edx/frontend-platform` with `@openedx/frontend-base`

frontend-base includes all exports from frontend-platform.  Rather than export them from sub-directories, it exports them all from the root package folder. As an example:

```diff
- import { getConfig } from '@edx/frontend-platform/config';
- import { logInfo } from '@edx/frontend-platform/logging';
- import { FormattedMessage } from '@edx/frontend-platform/i18n';
+ import {
+   getConfig,
+   logInfo,
+   FormattedMessage
+ } from '@openedx/frontend-base';
```

Note that the `configure` functions for auth, logging, and analytics are now exported with the names:

- configureAuth
- configureLogging
- configureAnalytics
- configureI18n

Remember to make the following substitution for these functions:

```diff
- import { configure as configureLogging } from '@openedx/frontend-platform/logging';
+ import { configureLogging } from '@openedx/frontend-base';
```

### 12. Replace the .env.test file with configuration in env.test.config.tsx file

We're moving away from .env files because they're not expressive enough (only string types!) to configure an Open edX frontend.  Instead, the test suite has been configured to expect an env.test.config.tsx file.  If you're initializing an application in your tests, frontend-base will pick up this configuration and make it available to getConfig(), etc.  If you need to manually access the variables, you an import `env.config` in your test files:

```diff
+ import config from 'env.config';
```

The Jest configuration has been set up to find `env.config` at an `env.test.config.tsx` file.

## Migrating to the frontend-base shell (:rotating_light: Work In Progress)

This is an interim migration that helps prepare an MFE to be released as a set of modules suitable for module federation or being included as a plugin into the shell application.

This migration may require some refactoring of the top-level files of the application; it is less straight-forward than simply replacing frontend-build and frontend-platform with frontend-base.

Prior to attempting this, you _must_ complete the steps above to migrate your MFE to use frontend-base instead of frontend-build and frontend-platform.

In spirit, in this migration we remove the initialization and header/footer code from the MFE and instead rely on the shell to manage our application.  We turn the MFE into a set of exported modules, and to maintain backwards compatibility, we create a small 'project' in the repository that helps us build the MFE as an independent application.

### 1. Remove initialization

In your index.(jsx|tsx) file, you need to remove the subscribe and initialization code.  If you have customizations here, they will need to migrate to your env.config.tsx file instead and take advantage of the shell's provided customization mechanisms.

### 2. Migrate header/footer dependencies

If your application uses a custom header or footer, you can use the shell's header and footer plugin slots to provide your custom header/footer components.  This is done through the env.config.tsx file.

### 3. Export the modules of your app as a component.

This may require a little interpretation.  In spirit, the modules of your app are the 'pages' of an Open edX Frontend site that it provides.  This likely corresponds to the top-level react-router routes in your app.  At the time of this writing, we don't have module federation yet, so to use the shell, you export all of your application code in a single component.  In frontend-app-profile, for instance, this is the ProfilePage component.  Some MFEs have put their router and pages directly into the index.jsx file inside the initialization callback - this code will need to be moved to a single component that can be exported.

### 4. Create a project.scss file

Create a new project.scss file at the top of your application.  It's responsible for:

1. Importing the shell's stylesheet, which includes Paragon's core stylesheet.
2. Importing your brand stylesheet.
3. Importing the stylesheets from your application.

You must then import this new stylesheet into your env.config.tsx file:

```diff
+ import './project.scss';

const config = {
  // config document
}

export default config;
```

### 5. Add new build scripts to package.json

After the previous steps, the legacy `build` and `start` scripts in package.json will no longer work properly.  They need to be replaced with versions from the `openedx` CLI that:

- Build the MFE for production using the shell application.
- Build the MFE for dev using the shell application.
- Build the MFE for release as a library.

## Merging repositories

Followed this process: https://stackoverflow.com/questions/13040958/merge-two-git-repositories-without-breaking-file-history

After adding a remote of the repo to merge in, run this command:

```
git merge other-repo-remote/master --allow-unrelated-histories
```

Then work through the conflicts and use a merge commit to add the history into the frontend-base.

Then move the files out of the way (move src to some other sub-dir, mostly) to make room for the next repo.
