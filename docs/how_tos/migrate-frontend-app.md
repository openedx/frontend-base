Migrating an MFE to frontend-base
=================================

To use the latest version of `frontend-base` from a git repository, you'll need to use `npm pack` and install it into your MFE from the resulting `.tgz` file.

Following these steps turns your MFE into a library that can be built using frontend-base and its shell application.  It involves deleting a lot of unneeded dependencies and code.


Clone this repository
=====================

Clone this repository as a peer of your micro-frontend folder(s).


npm install and npm run build in frontend-base
==============================================

You'll need to install dependencies and then build this repo at least once.


Remove undesired features
=========================

Here or at any point below, consider removing any undesired or previously deprecated features from the codebase, such as organization-specific code.  (Just remember to follow the DEPR process for previously undeprecated code.)  This will make the refactoring process proportionately easier.


Modernize the README
====================

You can start by modernizing the main README, such as:

- Removing references to the devstack, leaving only Tutor instructions
- Change "MFE" to "frontend app"

As you refactor the app, come back to the README and update it accordingly.


Change dependencies in package.json in MFE
==========================================

Uninstall replaced dependencies
-------------------------------

- Uninstall `@edx/frontend-platform`
- Uninstall `@openedx/frontend-build`
- Uninstall `@edx/frontend-component-header` if it is installed.
- Uninstall `@edx/frontend-component-footer` if it is installed.
- Uninstall `@openedx/frontend-plugin-framework` if it is installed.

```
npm uninstall @edx/frontend-platform @openedx/frontend-build
npm uninstall @edx/frontend-component-header @edx/frontend-component-footer @openedx/frontend-plugin-framework
```

Remove obsolete dependencies
--------------------------------------

We don't need these anymore, remove them from the package.json dependencies and remove any imports of them in the code:

- `@edx/reactifex`
- `husky`
- `glob`

Delete package-lock.json and node_modules
-----------------------------------------

```sh
rm package-lock.json
rm -rf node_modules
```

Move dependencies to peerDependencies
-------------------------------------

Dependencies shared with the shell should be moved to peerDependencies.  These include:

```diff
"dependencies" {
-  "@openedx/paragon": "^23.4.5",
-  "@tanstack/react-query": "^5.81.2",
-  "react": "^17.0.2",
-  "react-dom": "^17.0.2",
-  "react-router": "^6.26.1",
-  "react-router-dom": "^6.26.1",
},
"peerDependencies": {
+  "@openedx/paragon": "^23",
+  "@tanstack/react-query": "^5",
+  "react": "^18",
+  "react-dom": "^18",
+  "react-router": "^6",
+  "react-router-dom": "^6",
}
```

Note that it's possible that when doing this, you encounter peer conflict errors that you must resolve.  A good way to do this is to temporarily remove all dependencies, add the `peerDependencies` and `npm i`, then add `devDependencies` and `npm i` again, followed by your other `dependencies`.  This will ensure that your dependency versions work around the peer dependencies, rather than the other way around.

Run a fresh npm install
-----------------------

```sh
npm install
```

This gives us a clean baseline.  Historically, changes to dependencies have caused subtle and confusing problems without a clean re-installation like the above.

Add frontend-base to dependencies
---------------------------------

Run:

```sh
npm i --save-peer @openedx/frontend-base@alpha
```

Your package.json should now have a line like this:

```diff
"peerDependencies": {
+ "@openedx/frontend-base": "^1.0.0-alpha.0",
},
```

Edit package.json scripts
-------------------------

With the exception of any custom scripts, replace the `scripts` section of your MFE's package.json file with the following:

```json
  "scripts": {
    "dev": "PORT=YOUR_PORT PUBLIC_PATH=/YOUR_APP_NAME openedx dev",
    "i18n_extract": "openedx formatjs extract",
    "lint": "openedx lint .",
    "lint:fix": "openedx lint --fix .",
    "snapshot": "openedx test --updateSnapshot",
    "test": "openedx test --coverage --passWithNoTests"
  },
```

- Replace `YOUR_PORT` with the desired port, of course.
- Replace  `YOUR_APP_NAME` with the basename used on your site.config, not doing this will result in only the root route working.
- Note that `fedx-scripts` no longer exists, and has been replaced with `openedx`.

> [!TIP]
> **Why change `fedx-scripts` to `openedx`?**
> A few reasons.  One, the Open edX project shouldn't be using the name of an internal community of practice at edX for its frontend tooling.  Two, some dependencies of your MFE invariably still use frontend-build for their own build needs.  This means that they already installed `fedx-scripts` into your `node_modules/.bin` folder.  Only one version can be in there, so we need a new name.  Seemed like a great time for a naming refresh. |

Other package.json edits
------------------------

- Change the author to "Open edX"

main
----

```json
"main": "src/index.ts",
```

files
-----

This is a buildless library, so we package files in `src`:

```json
"files": [
  "/src"
],
```

sideEffects
-----------

This means that the code from the library can be safely tree-shaken by webpack.

```json
"sideEffects": [
  "*.css",
  "*.scss"
],
```

Namespace, author, etc
----------------------

Finally, make sure the following fields are set properly:


```
"name": "@openedx/frontend-app-[YOUR_APP]",
"version": "1.0.0",
"author": "Open edX",
"license": "AGPL-3.0",
```

Clean up .npmignore
===================

This is what should be in the repo's `.npmignore`.  No more, no less:

```
__mocks__
node_modules
*.test.js
*.test.jsx
*.test.ts
*.test.tsx
```

Clean up .gitignore
===================

This is the current standard `.gitignore`:

```
node_modules
npm-debug.log
coverage
module.config.js
dist/
/*.tgz

### i18n ###
src/i18n/transifex_input.json

### Editors ###
.DS_Store
*~
/temp
/.vscode
```


Add a Type Declaration file (app.d.ts)
======================================

Create an `app.d.ts` file in the root of your MFE with the following contents:

```ts
/// <reference types="@openedx/frontend-base" />

declare module 'site.config' {
  export default SiteConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
```


Add a tsconfig JSON file
========================

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
    "site.config.*.tsx",
  ],
}
```

This assumes you have a `src` folder and your build goes in `dist`, which is the best practice.


Edit jest.config.js
===================

Replace the import from 'frontend-build' with 'frontend-base'.

```diff
- const { createConfig } = require('@openedx/frontend-build');
+ const { createConfig } = require('@openedx/frontend-base/config');
```

Use 'test' instead of 'jest' as the config type for createConfig()

```js
module.exports = createConfig('test', {
  // ... custom config
})
```

Jest test suites that test React components that import SVG and files must add mocks for those filetypes.  This can be accomplished by adding the following module name mappers to jest.config.js:

```js
moduleNameMapper: {
  '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/file.js',
},
```

Then, create a `src/__mocks__` folder and add the necessary mocks.

**svg.js:**

```js
module.exports = 'SvgURL';
```

**file.js:**

```js
module.exports = 'FileMock';
```

You can change the values of "SvgURL", and "FileMock" if you want to reduce changes necessary to your snapshot tests; the old values from frontend-build assume svg is only being used for icons, so the values referenced an "icon" which felt unnecessarily narrow.

This is necessary because we cannot write a tsconfig.json in frontend apps that includes transpilation of the "tools/jest" folder in frontend-base, it can't meaningfully find those files and transpile them, and we wouldn't want all apps to have to include such idiosyncratic configuration anyway.  The SVG mock, however, requires ESModules syntax to export its default and ReactComponent exports at the same time.  This means without moving the mocks into the app code, the SVG one breaks transpilation and doesn't understand the `export` syntax used.  By moving them into the app, they can be easily transpiled along with all the other code when jest tries to run.

Resulting jest.config.js file
-----------------------------

An uncustomized jest.config.js looks like:

```js
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


Add a babel.config.js file for Jest
===================================

Jest needs a babel.config.js file to be present in the repository.  It should look like:

```js
const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('babel');
```


Merge site.config into config in setupTest.js
=============================================

frontend-platform used environment variables to seed the configuration object, meaning it had default values at the time code is loaded based on `process.env` variables.  frontend-base has a hard-coded, minimal configuration object that _must_ be augmented by a valid site config file at initialization time.  This means that any tests that rely on configuration (e.g., via `getSiteConfig()`) must first initialize the configuration object.  This can be done for tests by adding these lines to `setupTest.js`:

```js
import siteConfig from 'site.config';
import { mergeSiteConfig } from '@openedx/frontend-base';

mergeSiteConfig(siteConfig);

```

Replace .eslintrc.js with eslint.config.js
==========================================

ESLint has been upgraded to v9, which has a new 'flat' file format.  Replace the repository's `.eslintrc.js` file with a new `eslint.config.js` file with the following contents:

```js
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


Replace .eslintignore, if it exists, with entries in eslint.config.js
=====================================================================

The base eslint config provided by frontend-base ignores a number of common folders by default:

```js
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


Search for any other usages of frontend-build
=============================================

Find any other imports/usages of `frontend-build` in your repository and replace them with `frontend-base` so they don't break.


i18n
====

Description fields are now required on all i18n messages in the repository.  This is because of a change to the ESLint config.

Also, replace the contents of `src/i18n/index.js` with:

```
// Placeholder be overridden by `make pull_translations`
export default {
  ar: {},
  'zh-hk': {},
  'zh-cn': {},
  uk: {},
  'tr-tr': {},
  th: {},
  te: {},
  ru: {},
  'pt-pt': {},
  'pt-br': {},
  'it-it': {},
  id: {},
  hi: {},
  he: {},
  'fr-ca': {},
  fa: {},
  'es-es': {},
  'es-419': {},
  el: {},
  'de-de': {},
  da: {},
  bo: {},
};
```

Finally, edit the `Makefile` so that no strings are being pulled from `frontend-component-(header|footer)`, and rename `frontend-platform` to `frontend-base`.  Such as:

```Makefile
# Pulls translations using atlas.
pull_translations:
	mkdir src/i18n/messages
	cd src/i18n/messages \
	   && atlas pull $(ATLAS_OPTIONS) \
	            translations/frontend-base/src/i18n/messages:frontend-base \
	            translations/paragon/src/i18n/messages:paragon \
	            translations/frontend-app-[YOUR_APP]/src/i18n/messages:frontend-app-[YOUR_APP]

	$(intl_imports) frontend-base paragon frontend-app-[YOUR_APP]
```
```
```

SVGR "ReactComponent" imports have been removed
===============================================

We have removed the `@svgr/webpack` loader because it was incompatible with more modern tooling (it requires Babel).  As a result, the ability to import SVG files into JS as the `ReactComponent` export no longer works.  We know of a total of 5 places where this is happening today in Open edX MFEs - frontend-app-learning and frontend-app-profile use it.  Please replace that export with the default URL export and set the URL as the source of an `<img>` tag, rather than using `ReactComponent`.  You can see an example of normal SVG imports in `test-site/src/ExamplePage.tsx`.


Import createConfig and getBaseConfig from @openedx/frontend-base/config
========================================================================

In frontend-build, `createConfig` and `getBaseConfig` could be imported from the root package (`@openedx/frontend-build`).  They have been moved to a sub-directory to make room for runtime exports from the root package (`@openedx/frontend-base`).

```diff
- const { createConfig, getBaseConfig } = require('@openedx/frontend-build');
+ const { createConfig, getBaseConfig } = require('@openedx/frontend-base/config');
```

You may have handled this in steps 4 and 5 above (jest.config.js and .eslintrc.js)


Replace all imports from @edx/frontend-platform with @openedx/frontend-base
===========================================================================

`frontend-base` includes all exports from `frontend-platform`.  Rather than export them from sub-directories, it exports them all from the root package folder. As an example:

```diff
- import { getConfig } from '@edx/frontend-platform/config';
- import { logInfo } from '@edx/frontend-platform/logging';
- import { FormattedMessage } from '@edx/frontend-platform/i18n';
+ import {
+   getSiteConfig,
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

Finally:

- Replace all instances of `AppProvider` with `SiteProvider`


Dealing with jest.mock of @edx/frontend-platform
================================================

You may find that your test suite explicitly mocks parts of frontend-platform; this is usually done by sub-folder, and sometimes replaces the import with mocked versions of some functions:

```js
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
  fetchAuthenticatedUser: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logInfo: jest.fn(),
}));
```

This is problematic now that all imports from frontend-base are from the root package folder, as it means you'll be mocking much more than you intended:

```js
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


Delete the .env and .env.development files and create site.config files.
========================================================================

Frontend-base uses `site.config.*.tsx` files for configuration, rather than .env files.  The development file is `site.config.dev.tsx`, and the test file is `site.config.test.tsx`; these are the only ones that needs to be included in the app.

Site config is a new schema for configuration.  Notably, config variables are camelCased like normal JavaScript variables, rather than SCREAMING_SNAKE_CASE.

Required config
---------------

The required configuration at the time of this writing is:

- siteId: string
- siteName: string
- baseUrl: string
- lmsBaseUrl: string
- loginUrl: string
- logoutUrl: string

Optional config
---------------

Other configuration is now optional, and many values have been given sensible defaults.  But these configuration variables are also available (as of this writing):

- environment: EnvironmentTypes
- basename: string
- runtimeConfigJsonUrl: string | null
- accessTokenCookieName: string
- languagePreferenceCookieName: string
- userInfoCookieName: string
- csrfTokenApiPath: string
- refreshAccessTokenApiPath: string
- ignoredErrorRegex: RegExp | null
- segmentKey: string | null

URL Config changes
------------------

Note that the .env files and env.config.js files also include a number of URLs for various micro-frontends and services.  These URLs should now be expressed as part of the `apps` config as route roles, and used in code via `getUrlForRouteRole()`.  Or as externalRoutes.

```js
// Creating a route role with for 'example' in an App
const app: App = {
  ...
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

App-specific config values
--------------------------

App-specific configuration can be expressed by adding an `config` section to the app, allowing arbitrary variables:

```js
const app: App = {
  ...
  config: {
    myCustomVariableName: 'my custom variable value',
  },
};
```

These variables can be used in code with the `getAppConfig` function:

```js
getAppConfig('myapp').myCustomVariableName
```

Or via `useAppConfig()` (with no need to specify the appId), if `CurrentAppProvider` is wrapping your app.

Complete examples
-----------------

Refer to the frontend-base branch in frontend-template-application for complete examples of `site.config.dev.tsx` and `site.config.test.tsx`.


src file structure
==================

Observe the following file and directory structure.  Not counting any extra files the MFE needs, this is what the `src` directory should look like for all frontend apps in the Open edX org:

```
src
(...)
├── slots
├── widgets
├── Main.jsx
├── app.scss
├── app.ts
├── constants.ts
├── index.ts
├── messages.js
├── providers.ts
├── routes.tsx
├── setupTest.tsx
└── slots.tsx
```

A brief explanation of the new ones:

- `slots`: renamed from `plugin-slots`
- `widgets`: where any built-in widgets should be created
- `Main.jsx`: the spiritual successor to `index.jsx`: where the root component is defined, including an `<Outlet />` if the main route has children
- `constants.ts`: should contain an export of the app's `appId`
- `index.ts`: the MFE is now a library, and this is where all the interesting bits are exported; this file should only contain exports, no react components
- `app.ts`: the app configuration that will be imported by `site.config` files
- `providers.ts`: where global context providers are defined
- `routes.tsx`: where the app's routes are declared
- `slots.tsx`: what slots the app _uses_; this is distinct from the slots the app _offers_, which are defined in the `slots` directory

Create, rename, and/or move file contents around to match.  Refer to a previously converted MFE (such as [Learner Dashboard](https://github.com/openedx/frontend-app-learner-dashboard/tree/frontend-base/src)) for examples.


Replace the .env.test file with configuration in site.config.test.tsx file
==========================================================================

We're moving away from .env files because they're not expressive enough (only string types!) to configure an Open edX frontend.  Instead, the test suite has been configured to expect a `site.config.test.tsx` file.  If you're initializing an application in your tests, `frontend-base` will pick up this configuration and make it available to `getSiteConfig()`, etc.  If you need to manually access the variables, you can import `site.config` in your test files:

```diff
+ import siteConfig from 'site.config';
```

The Jest configuration has been set up to find `site.config` in a `site.config.test.tsx` file.

Once you've verified your test suite still works, you should delete the `.env.test` file.

A sample `site.config.test.tsx` file:

```js
import { EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

const siteConfig: SiteConfig = {
  siteId: 'test',
  siteName: 'localhost',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  environment: EnvironmentTypes.TEST,
  apps: [{
    appId: 'test-app',
    routes: [{
      path: '/app1',
      element: (
        <div>Test App 1</div>
      ),
      handle: {
        role: 'test-app-1'
      }
    }]
  }],
  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
  csrfTokenApiPath: '/csrf/api/v1/token',
  languagePreferenceCookieName: 'openedx-language-preference',
  refreshAccessTokenApiPath: '/login_refresh',
  userInfoCookieName: 'edx-user-info',
  ignoredErrorRegex: null,
};

export default siteConfig;
```


Remove initialization
=====================

In your index.(jsx|tsx) file, you need to remove the subscribe and initialization code.  If you have customizations here, they will need to migrate to your `site.config` file instead and take advantage of the shell's provided customization mechanisms.


Migrate header/footer dependencies
==================================

If your application uses a custom header or footer, you can use the shell's header and footer plugin slots to provide your custom header/footer components.  This is done through the `site.config` file.


Export the modules of your app in your index.ts file.
=====================================================

This may require a little interpretation.  In spirit, the modules of your app are the 'pages' of an Open edX Frontend site that it provides.  This likely corresponds to the top-level react-router routes in your app.  In frontend-app-profile, for instance, this is the `ProfilePage` component, amongst a few others.  Some MFEs have put their router and pages directly into the `index.jsx` file inside the initialization callback - this code will need to be moved to a single component that can be exported.

These modules should be unopinionated about the path prefix where they are mounted.


Create an app.scss file 
=======================

This is required for running the app in dev mode.

Create a new `app.scss` file at the top of your application.  It's responsible for:

1. Using the shell's stylesheet, which includes Paragon's core stylesheet.
2. Using the stylesheets from your application, if any.

For example:

```
@use "@openedx/frontend-base/shell/app.scss";
@use "sass/style";
```

You must then import this file from your `site.config.dev.tsx` file:

```diff
+ import './app.scss';

const siteConfig: SiteConfig = {
  // config document
}

export default siteConfig;
```


Document module-specific configuration needs
============================================

Your modules will need environment variables that your system merged into config in index.jsx - we need to document and expect those when the module is loaded.  You'll need this list in the next step.


Stop using process.env
======================

Instead, custom variables must go through site config.  This can be done by adding a 'config' object to the App's definition


Convert @import to @use in SCSS files
=====================================

@import is deprecated in the most recent versions of SASS.  It must be converted to @use.

If still importing Paragon SCSS variables, you will find that they, in particular, are likely to result in errors when building the app in webpack.  The app should be migrated to use CSS variables from Paragon 23, as per [the corresponding howto](https://openedx.atlassian.net/wiki/spaces/BPL/pages/3770744958/Migrating+MFEs+to+Paragon+design+tokens+and+CSS+variables).

Changes to i18n
===============

configureI18n no longer takes `config` or `loggingService` as options

The `getLoggingService` export from _i18n_ has also been removed.  No one should be using that.

`getLanguageList` has been removed. Modules that need a list of countries should install `@cospired/i18n-iso-languages` as a dependency.

`getSupportedLanguageList` now returns an array of objects containing the `name` and `code` of all the languages that have translations bundled with the app, rather than a hard-coded list.

`getCountryList` has been removed.  MFEs that need a list of countries should install `i18n-iso-countries` or `countries-list` as a dependency.

The getCountryList function can be reproduced from this file in frontend-platform: https://github.com/openedx/frontend-platform/blob/master/src/i18n/countries.js

frontend-app-account should use the supported language list from frontend-base, rather than the hard-coded list in https://github.com/openedx/frontend-app-account/blob/master/src/account-settings/site-language/constants.js

This would help it match the behavior of the footer's language dropdown.


react-query
===========

If the MFE uses react-query version 4 or below, upgrade it to 5 as per [this guide](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5).  Also remove any instances of `<QueryClientProvider />`, as the shell already provides a global one.

If the MFE uses Redux, consider porting the app over to react-query, as it will make it much easier to handle header (and footer) customization.


Removal of pubsub-js
====================

frontend-platform used pubsub-js behind the scenes for event subscriptions/publishing.  It used it in a very rudimentary way, and the library was noisy in test suites, complaining about being re-initialized.  Because of these reasons, we've removed our dependency on pubsub-js and replaced it with a simple subscription system with a very similar API:

- `subscribe(topic: string, callback: (topic: string, data?: any) => void)`
- `publish(topic: string, data?: any)`
- `unsubscribe(topic: string, callback: (topic: string, data?: any) => void)`
- `clearAllSubscriptions()`

The unsubscribe function as a different API than pubsub-js's unsubscribe function, taking a topic and a callback rather than an unsubscribe token.

Consumers who were using the `PubSub` global variable should instead import the above functions directly from `@openedx/frontend-base`.


Refactor slots
==============

First, rename `src/plugin-slots`, if it exists, to `src/slots`.  Modify imports and documentation across the codebase accordingly.

Next, the frontend-base equivalent to `<PluginSlot />` is `<Slot />`, and has a different API.   This includes a change in the slot ID, according to the [new slot naming ADR](../decisions/0009-slot-naming-and-lifecycle.rst) in this repository.  Rename them accordingly. You can refer to the `src/shell/dev` in this repository for examples.


Remove build step from CI
=========================

In `.github/workflow/ci.yml`, remove the build step.

```diff
    - name: Test
      run: npm run test
-    - name: Build
-      run: npm run build
    - name: i18n_extract
      run: npm run i18n_extract
```
```
