## Migrating an MFE to `frontend-base` (Work in progress)

| :rotating_light: Pre-alpha                                                                |
|:------------------------------------------------------------------------------------------|
| This library is not yet published to NPM.  It is not ready for production use, and you should only migrate an MFE on a branch as a test. |

To use `frontend-base`, you'll need to use `npm pack` and install it into your MFE from the resulting `.tgz` file.

Following these steps turns your MFE into a library that can be built using frontend-base and its shell application.  It involves deleting a lot of unneeded dependencies and code.

### 1. Clone this repository

  Clone this repository as a peer of your micro-frontend folder(s).

### 2. `npm install` and `npm run build` in frontend-base

You'll need to install dependencies and then build this repo at least once.

### 3. Change dependencies in package.json in MFE

We need to:

- Uninstall `@edx/frontend-platform`
- Uninstall `@openedx/frontend-build`

- Add frontend-base to dependencies

```
npm uninstall @edx/frontend-platform @openedx/frontend-build
```

And then use `npm pack` and `npm i` to add `frontend-base` to package.json's dependencies:

- In `frontend-base` run `npm pack`.  A file named `openedx-frontend-base-1.0.0.tgz` will be created.
- In your MFe, run `npm i --save-peer ../frontend-base/openedx-frontend-base-1.0.0.tgz`

Your package.json should now have a line like this:

```
"dependencies": {
+ "@openedx/frontend-base": "file:../frontend-base/openedx-frontend-base-1.0.0.tgz",
},
```

If `frontend-base` changes, you'll need to repeat these steps.

After doing these two steps, your package.json should have changed in this way:

### 4. `npm install`in MFE

Just to be sure you don't run into any dependency skew issues, delete the MFE's `node_modules` and `package-lock.json`.  Then run `npm install` again to make sure we've fully cleaned out frontend-platform and frontend-build's downstream dependencies.  Historically, messing with frontend-build has caused big problems if you don't do this.

```
rm -rf node_modules
rm package-lock.json
npm install
```

### 5. Edit package.json `scripts`

With the exception of any custom scripts, replace the `scripts` section of your MFE's package.json file with the following:

```
  "scripts": {
    "build:module": "PORT=YOUR_PORT openedx build:module",
    "dev": "PORT=YOUR_PORT openedx dev",
    "dev:module": "PORT=YOUR_PORT openedx dev:module",
    "i18n_extract": "openedx formatjs extract",
    "lint": "openedx lint .",
    "lint:fix": "openedx lint --fix .",
    "pack": "openedx pack",
    "release": "openedx release",
    "serve": "PORT=YOUR_PORT openedx serve",
    "snapshot": "openedx test --updateSnapshot",
    "test": "openedx test --coverage --passWithNoTests"
  },
```

- Replace `YOUR_PORT` with the desired port, of course.
- Note that `fedx-scripts` no longer exists, and has been replaced with `openedx`.


> [!TIP]
> **Why change `fedx-scripts` to `openedx`?**
> A few reasons.  One, the Open edX project shouldn't be using the name of an internal community of practice at edX for its frontend tooling.  Two, some dependencies of your MFE invariably still use frontend-build for their own build needs.  This means that they already installed `fedx-scripts` into your `node_modules/.bin` folder.  Only one version can be in there, so we need a new name.  Seemed like a great time for a naming refresh. |

### 6. Add a Type Declaration file (app.d.ts)

Create an `app.d.ts` file in the root of your MFE with the following contents:

```
/// <reference types="@openedx/frontend-base" />

declare module "*.svg" {
  const content: string;
  export default content;
}
```

This will ensure that you can import SVG files, and have type declarations for the frontend-base library.

### 7. Add a tsconfig JSON files

Create a `tsconfig.json` file and add the following contents to it:

```
{
  "extends": "@openedx/frontend-base/config/tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist",
  },
  "include": [
    "src/**/*",
    "app.d.ts",
    "babel.config.js",
    ".eslintrc.js",
    "jest.config.js",
    "test.site.config.tsx",
    "site.config.tsx",
    "site.config.*.tsx",
  ]
}
```

Create a `tsconfig.build.json` file and add the following contents to it:

```
{
  "extends": "@openedx/frontend-base/config/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "noEmit": false,
  },
  "include": [
    "src/**/*",
  ],
  "exclude": [
    "src/__mocks__",
    "src/setupTest.js",
  ]
}
```

This assumes you have a `src` folder and your build goes in `dist`, which is the best practice.

### 8. Edit `jest.config.js`

Replace the import from 'frontend-build' with 'frontend-base'.

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

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

#### Resulting `jest.config.js` file

An uncustomized jest.config.js looks like:

```
const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('jest', {
  // setupFilesAfterEnv is used after the jest environment has been loaded.  In general this is what you want.
  // If you want to add config BEFORE jest loads, use setupFiles instead.
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
    'src/__mocks__',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/file.js',
  },
});
```

### 9. Edit `.eslintrc.js`

Replace the import from 'frontend-build' with 'frontend-base'.

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

You will also need to set the `project` in `parserOptions`.  An uncustomized `.eslintrc.js` file looks like:

```
const path = require('path');

const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('eslint', {
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },
});
```

### 10. Search for any other usages of `frontend-build`

Find any other imports/usages of `frontend-build` in your repository and replace them with `frontend-base` so they don't break.

### 11. i18n Descriptions

Description fields are now required on all i18n messages in the repository.  This is because of a change to the ESLint config.

### 12. SVGR "ReactComponent" imports have been removed.

We have removed the `@svgr/webpack` loader because it was incompatible with more modern tooling (it requires Babel).  As a result, the ability to import SVG files into JS as the `ReactComponent` export no longer works.  We know of a total of 5 places where this is happening today in Open edX MFEs - frontend-app-learning and frontend-app-profile use it.  Please replace that export with the default URL export and set the URL as the source of an `<img>` tag, rather than using `ReactComponent`.  You can see an example of normal SVG imports in `test-project/src/ExamplePage.tsx`.

### 13. Import `createConfig` and `getBaseConfig` from `@openedx/frontend-base/config`

In frontend-build, `createConfig` and `getBaseConfig` could be imported from the root package (`@openedx/frontend-build`).  They have been moved to a sub-directory to make room for runtime exports from the root package (`@openedx/frontend-base`).

```diff
- const { createConfig, getBaseConfig } = require('@openedx/frontend-build');
+ const { createConfig, getBaseConfig } = require('@openedx/frontend-base/config');
```

You may have handled this in steps 4 and 5 above (jest.config.js and .eslintrc.js)

### 14. Replace all imports from `@edx/frontend-platform` with `@openedx/frontend-base`

`frontend-base` includes all exports from `frontend-platform`.  Rather than export them from sub-directories, it exports them all from the root package folder. As an example:

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

- `configureAuth`
- `configureLogging`
- `configureAnalytics`
- `configureI18n`

Remember to make the following substitution for these functions:

```diff
- import { configure as configureLogging } from '@openedx/frontend-platform/logging';
+ import { configureLogging } from '@openedx/frontend-base';
```

### 15. Replace the .env.test file with configuration in test.site.config.tsx file

We're moving away from .env files because they're not expressive enough (only string types!) to configure an Open edX frontend.  Instead, the test suite has been configured to expect an test.site.config.tsx file.  If you're initializing an application in your tests, frontend-base will pick up this configuration and make it available to getConfig(), etc.  If you need to manually access the variables, you an import `site.config` in your test files:

```diff
+ import config from 'site.config';
```

The Jest configuration has been set up to find `site.config` at an `test.site.config.tsx` file.

### 16. Remove initialization

In your index.(jsx|tsx) file, you need to remove the subscribe and initialization code.  If you have customizations here, they will need to migrate to your `site.config` file instead and take advantage of the shell's provided customization mechanisms.  **This functionality is still a work in progress.**

### 17. Migrate header/footer dependencies

If your application uses a custom header or footer, you can use the shell's header and footer plugin slots to provide your custom header/footer components.  This is done through the `site.config` file.  **This functionality is still a work in progress.**

### 18. Export the modules of your app in your index.ts file.

This may require a little interpretation.  In spirit, the modules of your app are the 'pages' of an Open edX Frontend site that it provides.  This likely corresponds to the top-level react-router routes in your app.  In frontend-app-profile, for instance, this is the `ProfilePage` component, amongst a few others.  Some MFEs have put their router and pages directly into the `index.jsx` file inside the initialization callback - this code will need to be moved to a single component that can be exported.

These modules should be unopinionated about the path prefix where they are mounted.  The exact way we handle routing is still being figured out.  In the short term, the react-router data APIs are not suppored until we can figure out how to implement lazy route discovery (a.k.a., "Fog of War")  Using `<Routes>` with `<Route>` components inside it works today.  **This functionality is still a work in progress, and is one of the big things we need to figure out.**

### 19. Create a project.scss file

Create a new `project.scss` file at the top of your application.  It's responsible for:

1. Importing the shell's stylesheet, which includes Paragon's core stylesheet.
2. Importing your brand stylesheet.
3. Importing the stylesheets from your application.

You must then import this new stylesheet into your `site.config` file:

```diff
+ import './project.scss';

const config: ProjectSiteConfig = {
  // config document
}

export default config;
```
