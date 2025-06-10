# Migrating an MFE to `frontend-base` (Work in progress)

| :rotating_light: Pre-alpha                                                                |
|:------------------------------------------------------------------------------------------|
| This library is not yet published to NPM.  It is not ready for production use, and you should only migrate an MFE on a branch as a test. |

To use `frontend-base`, you'll need to use `npm pack` and install it into your MFE from the resulting `.tgz` file.

Following these steps turns your MFE into a library that can be built using frontend-base and its shell application.  It involves deleting a lot of unneeded dependencies and code.

## 1. Clone this repository

  Clone this repository as a peer of your micro-frontend folder(s).

## 2. `npm install` and `npm run build` in frontend-base

You'll need to install dependencies and then build this repo at least once.

## 3. Change dependencies in package.json in MFE

### Uninstall replaced dependencies

- Uninstall `@edx/frontend-platform`
- Uninstall `@openedx/frontend-build`
- Uninstall `@edx/frontend-component-header` if it is installed.
- Uninstall `@edx/frontend-component-footer` if it is installed.
- Uninstall `@openedx/frontend-plugin-framework` if it is installed.

```
npm uninstall @edx/frontend-platform @openedx/frontend-build
npm uninstall @edx/frontend-component-header @edx/frontend-component-footer @openedx/frontend-plugin-framework
```

### Delete `package-lock.json` and `node_modules`

```
rm package-lock.json
rm -rf node_modules
```

### Move dependencies to peerDependencies

Dependencies shared with the shell should be moved to peerDependencies.  These include:

```diff
"dependencies" {
-  "@openedx/paragon": "^22.8.1",
-  "react": "^17.0.2",
-  "react-dom": "^17.0.2",
-  "react-redux": "^8.1.3",
-  "react-router": "^6.26.1",
-  "react-router-dom": "^6.26.1",
-  "redux": "^4.2.1"
},
"peerDependencies": {
+  "@openedx/paragon": "^22.8.1",
+  "react": "^17.0.2",
+  "react-dom": "^17.0.2",
+  "react-redux": "^8.1.3",
+  "react-router": "^6.26.1",
+  "react-router-dom": "^6.26.1",
+  "redux": "^4.2.1"
}
```

Note that it's possible that when doing this, you encounter peer conflict errors that you must resolve.  A good way to do this is to temporarily remove all dependencies, add the `peerDependencies` and `npm i`, then add `devDependencies` and `npm i` again, followed by your other `dependencies`.  This will ensure that your dependency versions work around the peer dependencies, rather than the other way around.

### Run a fresh npm install

```
npm install
```

This gives us a clean baseline.  Historically changes to the dependencies in `frontend-build` have caused subtle and confusing problems without a clean re-installation like the above.

### Add frontend-base to dependencies

In your checkout of `frontend-base`, build the library:

```
npm run build
```

And then pack it into a .tgz file and install it into your frontend-app repository:

```
npm pack
```

This will create a file in `frontend-base` called `openedx-frontend-base-1.0.0.tgz`.

```
cd ../frontend-app-YOUR-APP
npm i --save-peer ../frontend-base/openedx-frontend-base-1.0.0.tgz
```

Your package.json should now have a line like this:

```diff
"peerDependencies": {
+ "@openedx/frontend-base": "file:../frontend-base/openedx-frontend-base-1.0.0.tgz",
},
```

If `frontend-base` changes, you'll need to repeat these steps.

## 4. Edit package.json `scripts`

With the exception of any custom scripts, replace the `scripts` section of your MFE's package.json file with the following:

```
  "scripts": {
    "build": "PORT=YOUR_PORT openedx build",
    "build:legacy": "openedx build:legacy", // TODO: Does this target exist?
    "dev": "PORT=YOUR_PORT openedx dev",
    "dev:legacy": "PORT=YOUR_PORT openedx dev:legacy",
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

## 5. Other package.json edits

- `main`

```diff
+ "main": "src/index.ts",
```

- `sideEffects`

This means that the code from the library can be safely tree-shaken by webpack.

```json
"sideEffects": [
  "*.css",
  "*.scss"
],
```

// TODO: Maybe put scss and css files in side effects.  They have side effects and need to be excluded so they get bundled.

## 6. Add a Type Declaration file (app.d.ts)

Create an `app.d.ts` file in the root of your MFE with the following contents:

```ts
/// <reference types="@openedx/frontend-base" />

declare module 'site.config' {
  export default ProjectSiteConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
```

## 7. Add a tsconfig JSON files

Create a `tsconfig.json` file and add the following contents to it:

```json
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
    "eslint.config.js",
    "jest.config.js",
    "test.site.config.tsx",
    "site.config.*.tsx",
  ],
}
```

This assumes you have a `src` folder and your build goes in `dist`, which is the best practice.

## 8. Edit `jest.config.js`

Replace the import from 'frontend-build' with 'frontend-base'.

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

Use 'test' instead of 'jest' as the config type for createConfig()

```
module.exports = createConfig('test', {
  // ... custom config
})
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

### Resulting `jest.config.js` file

An uncustomized jest.config.js looks like:

```
const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('test', {
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
## 9. Add a babel.config.js file for Jest

Jest needs a babel.config.js file to be present in the repository.  It should look like:

```
const config = require('@openedx/frontend-base/config/babel/babel.base.config');

module.exports = config;
```

## 10. Merge site.config into config in setupTest.js

frontend-platform used environment variables to seed the configuration object, meaning it had default values at the time code is loaded based on `process.env` variables.  frontend-base has a hard-coded, minimal configuration object that _must_ be augmented by a valid site config file at initialization time.  This means that any tests that rely on configuration (e.g., via `getConfig()`) must first initialize the configuration object.  This can be done for tests by adding these lines to `setupTest.js`:

```
import siteConfig from 'site.config';
import { mergeConfig } from '@openedx/frontend-base';

mergeConfig(siteConfig);

```

## 11. Replace `.eslintrc.js` with `eslint.config.js`

ESLint has been upgraded to v9, which has a new 'flat' file format.  Replace the repository's `.eslintrc.js` file with a new `eslint.config.js` file with the following contents:

```
// @ts-check

const { createLintConfig } = require('@openedx/frontend-base/config');

module.exports = createLintConfig(
  {
    files: [
      'src/**/*',
      'site.config.*',
    ],
  },
);
```

## 12. Replace `.eslintignore`, if it exists, with entries in `eslint.config.js`

The base eslint config provided by frontend-base ignores a number of common folders by default:

```
  {
    ignores: [
      'coverage/*',
      'dist/*',
      'node_modules/*',
      '**/__mocks__/*',
      '**/__snapshots__/*',
    ],
  },
```

You can configure additional ignores in your own `eslint.config.js` file using the above syntax, as a separate object from the existing 'files' object:

```diff
module.exports = createLintConfig(
  {
    files: [
      'src/**/*',
      'site.config.*',
    ],
  },
+  {
+    ignores: [
+      'ignoredfolder/*'
+    ]
+  }
);
```

## 12. Search for any other usages of `frontend-build`

Find any other imports/usages of `frontend-build` in your repository and replace them with `frontend-base` so they don't break.

## 13. i18n Descriptions

Description fields are now required on all i18n messages in the repository.  This is because of a change to the ESLint config.

## 14. SVGR "ReactComponent" imports have been removed.

We have removed the `@svgr/webpack` loader because it was incompatible with more modern tooling (it requires Babel).  As a result, the ability to import SVG files into JS as the `ReactComponent` export no longer works.  We know of a total of 5 places where this is happening today in Open edX MFEs - frontend-app-learning and frontend-app-profile use it.  Please replace that export with the default URL export and set the URL as the source of an `<img>` tag, rather than using `ReactComponent`.  You can see an example of normal SVG imports in `test-project/src/ExamplePage.tsx`.

## 15. Import `createConfig` and `getBaseConfig` from `@openedx/frontend-base/config`

In frontend-build, `createConfig` and `getBaseConfig` could be imported from the root package (`@openedx/frontend-build`).  They have been moved to a sub-directory to make room for runtime exports from the root package (`@openedx/frontend-base`).

```diff
- const { createConfig, getBaseConfig } = require('@openedx/frontend-build');
+ const { createConfig, getBaseConfig } = require('@openedx/frontend-base/config');
```

You may have handled this in steps 4 and 5 above (jest.config.js and .eslintrc.js)

## 16. Replace all imports from `@edx/frontend-platform` with `@openedx/frontend-base`

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

## 17. Dealing with `jest.mock` of `@edx/frontend-platform`

You may find that your test suite explicitly mocks parts of frontend-platform; this is usually done by sub-folder, and sometimes replaces the import with mocked versions of some functions:

```
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
  fetchAuthenticatedUser: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logInfo: jest.fn(),
}));
```

This is problematic now that all imports from frontend-base are from the root package folder, as it means you'll be mocking much more than you intended:

```
jest.mock('@openedx/frontend-base', () => ({
  getAuthenticatedUser: jest.fn(),
  fetchAuthenticatedUser: jest.fn(),
  logInfo: jest.fn(),
}));
```

The above will mock _everything_ but those three functions.  This will likely break many tests.

To get around this, consider patching the bulk of the implementations back into your mock via `jest.requireActual`:

```diff
jest.mock('@openedx/frontend-base', () => ({
+  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedUser: jest.fn(),
  fetchAuthenticatedUser: jest.fn(),
  logInfo: jest.fn(),
}));
```

In this case, the default implementations of most frontend-base exports are included, and only the three afterward are mocked.  In most cases, this should work.  If you have a more complicated mocking situation in your test, you may need to refactor the test.

## 18. Delete the `.env` and `.env.development` files and create site.config files.

Frontend-base uses `site.config.*.tsx` files for configuration, rather than .env files.  The development file is site.config.dev.tsx, and the production file is site.config.prod.tsx.

If you want to run a webpack build from your library, you will need to add a `site.config` file, such as `site.config.dev.tsx`.  These files are ignored via `.gitignore` and will not be checked in.  There will be resources available to help writing these files.

Site config is a new schema for configuration.  Notably, config variables are camelCased like normal JavaScript variables, rather than SCREAMING_SNAKE_CASE.

### Required config

The required configuration at the time of this writing is:

- appId: string
- siteName: string
- baseUrl: string
- lmsBaseUrl: string
- loginUrl: string
- logoutUrl: string

### Optional config

Other configuration is now optional, and many values have been given sensible defaults.  But these configuration variables are also available (as of this writing):

- accessTokenCookieName: string
- languagePreferenceCookieName: string
- userInfoCookieName: string
- csrfTokenApiPath: string
- refreshAccessTokenApiPath: string
- ignoredErrorRegex: RegExp | null
- segmentKey: string | null
- environment: EnvironmentTypes
- mfeConfigApiUrl: string | null
- publicPath: string

### URL Config changes

Note that the .env files and env.config.js files also include a number of URLs for various micro-frontends and services.  These URLs should now be expressed as part of the `apps` config as route roles, and used in code via `getUrlForRouteRole()`.  Or as externalRoutes.

```
// Creating a route role with for 'example' in an App
const app: App = {
  routes: [{
    path: '/example',
    id: 'example.page',
    Component: ExamplePage,
    handle: {
      role: 'example'
    }
  }],
};

// Using the role in code to link to the page
const examplePageUrl = getUrlForRouteRole('example');
```

### App-specific config values

App-specific configuration can be expressed by adding a `custom` section to SiteConfig which allows arbitrary config variables.

```
const config: ProjectSiteConfig = {
  // ... Other config

  custom: {
    appId: 'myapp',
    myCustomVariableName: 'my custom variable value',
  }
}
```

These variables can be used in code with the `getAppConfig` function:

```
getAppConfig('myapp').myCustomVariableName
```

If you have fully converted your app over to the new module architecture, you can add custom variables to the `config` object in your `App` definition and they will be available via `getAppConfig`.

## 19. Replace the `.env.test` file with configuration in `test.site.config.tsx` file

We're moving away from .env files because they're not expressive enough (only string types!) to configure an Open edX frontend.  Instead, the test suite has been configured to expect a `test.site.config.tsx` file.  If you're initializing an application in your tests, `frontend-base` will pick up this configuration and make it available to `getConfig()`, etc.  If you need to manually access the variables, you can import `site.config` in your test files:

Note that test.site.config.tsx has a different naming scheme than `site.config.*.tsx` because it's intended to be checked in, and `site.config.*.tsx` is git-ignored.

```diff
+ import config from 'site.config';
```

The Jest configuration has been set up to find `site.config` in a `test.site.config.tsx` file.

Once you've verified your test suite still works, you should delete the `.env.test` file.

A sample `test.site.config.tsx` file:

```
import { ProjectSiteConfig } from '@openedx/frontend-base';

const config: ProjectSiteConfig = {
  apps: [],
  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
  baseUrl: 'http://localhost:8080',
  csrfTokenApiPath: '/csrf/api/v1/token',
  languagePreferenceCookieName: 'openedx-language-preference',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  refreshAccessTokenApiPath: '/login_refresh',
  segmentKey: '',
  siteName: 'localhost',
  userInfoCookieName: 'edx-user-info',
  appId: 'authn',
  environment: 'dev',
  ignoredErrorRegex: null,
  publicPath: '/',
};

export default config;
```

## 20. Remove initialization

In your index.(jsx|tsx) file, you need to remove the subscribe and initialization code.  If you have customizations here, they will need to migrate to your `site.config` file instead and take advantage of the shell's provided customization mechanisms.

## 21. Migrate header/footer dependencies

If your application uses a custom header or footer, you can use the shell's header and footer plugin slots to provide your custom header/footer components.  This is done through the `site.config` file.

## 22. Export the modules of your app in your index.ts file.

This may require a little interpretation.  In spirit, the modules of your app are the 'pages' of an Open edX Frontend site that it provides.  This likely corresponds to the top-level react-router routes in your app.  In frontend-app-profile, for instance, this is the `ProfilePage` component, amongst a few others.  Some MFEs have put their router and pages directly into the `index.jsx` file inside the initialization callback - this code will need to be moved to a single component that can be exported.

These modules should be unopinionated about the path prefix where they are mounted.  The exact way we handle routing is still being figured out.  In the short term, the react-router data APIs are not suppored until we can figure out how to implement lazy route discovery (a.k.a., "Fog of War")  Using `<Routes>` with `<Route>` components inside it works today.  **This functionality is still a work in progress, and is one of the big things we need to figure out.**

## 23. Remove core-js and regenerator-runtime

We don't need these libraries anymore, remove them from the package.json dependencies and remove any imports of them in the code.

## 24. Create a project.scss file (Optional if you intend to run builds from this repository)

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

This file will be ignored via `.gitignore`, as it is part of your 'project', not the module library.

## 25. Document module-specific configuration needs

Your modules will need environment variables that your system merged into config in index.jsx - we need to document and expect those when the module is loaded.  You'll need this list in the next step.

## 26. Stop using process.env

Instead, custom variables must go through site config.  This can be done by adding a 'config' object to the App's definition

## 27. Convert @import to @use in SCSS files.

@import is deprecated in the most recent versions of SASS.

When you do this, you will find that variables and mixins from Paragon, in particular, are likely to result in errors when building the app in webpack.  To fix this, you must `@use` the paragon core SCSS file in the file where you want to use the variable or mixin:

```
@use "@openedx/paragon/scss/core/core" as paragon;
```

And then prefix the variable/mixin usage with `paragon.`:

```
// Using a mixin
@include paragon.media-breakpoint-up(lg) {

}

// Or a variable
paragon.$primary-700
```

## 28. Changes to i18n

configureI18n no longer takes `config` or `loggingService` as options

The `getLoggingService` export from _i18n_ has also been removed.  No one should be using that.

`getLanguageList` has been removed. Modules that need a list of countries should install `@cospired/i18n-iso-languages` as a dependency.

`getSupportedLanguageList` now returns an array of objects containing the `name` and `code` of all the languages that have translations bundled with the app, rather than a hard-coded list.

`getCountryList` has been removed.  MFEs that need a list of countries should install `i18n-iso-countries` or `countries-list` as a dependency.

The getCountryList function can be reproduced from this file in frontend-platform: https://github.com/openedx/frontend-platform/blob/master/src/i18n/countries.js

frontend-app-account should use the supported language list from frontend-base, rather than the hard-coded list in https://github.com/openedx/frontend-app-account/blob/master/src/account-settings/site-language/constants.js

This would help it match the behavior of the footer's language dropdown.

## 29. Removal of pubsub-js

frontend-platform used pubsub-js behind the scenes for event subscriptions/publishing.  It used it in a very rudimentary way, and the library was noisy in test suites, complaining about being re-initialized.  Because of these reasons, we've removed our dependency on pubsub-js and replaced it with a simple subscription system with a very similar API:

- `subscribe(topic: string, callback: (topic: string, data?: any) => void)`
- `publish(topic: string, data?: any)`
- `unsubscribe(topic: string, callback: (topic: string, data?: any) => void)`
- `clearAllSubscriptions()`

The unsubscribe function as a different API than pubsub-js's unsubscribe function, taking a topic and a callback rather than an unsubscribe token.

Consumers who were using the `PubSub` global variable should instead import the above functions directly from `@openedx/frontend-base`.

### 31. React router move to data router.

## 30. More art than science: find your module boundaries

From this step on, things get a bit more subjective.  At this point you need to ensure that the modules in your library are decoupled and well-bounded.  If you use Redux, this may mean creating individual redux stores for each module, including adding a context so that they're separate from any "upstream" redux stores that may exist.

https://react-redux.js.org/using-react-redux/accessing-store#multiple-stores
