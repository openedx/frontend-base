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

### 2. Edit package.json

- Replace the `@openedx/frontend-build` dependency with:

```
- "@openedx/frontend-build": "13.1.4",
+ "@openedx/frontend-base": "file:../frontend-base",
```

This will let your MFE use the checked out version of `frontend-base`.

### 3. `npm install`

Run `npm install` again to update your `node_modules` and `package-lock.json`.

### 4. Migrate your MFE

Follow the steps below to migrate an MFE to use frontend-base.

## Migrating to frontend-base

### 1. Edit package.json `scripts`

Replace all instances of `fedx-scripts` with `openedx` in your package.json file.

> [!TIP]
> **Why change `fedx-scripts` to `openedx`?**
> A few reasons.  One, the Open edX project shouldn't be using the name of an internal community of practice at edX for its frontend tooling.  Two, some dependencies of your MFE invariably still use frontend-build for their own build needs.  This means that they already installed `fedx-scripts` into your `node_modules/.bin` folder.  Only one version can be in there, so we need a new name.  Seemed like a great time for a naming refresh. |

### 2. Add a tsconfig.json file

Create a tsconfig.json file and add the following contents to it:

```
{
  "extends": "@openedx/frontend-base/config/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": [
    ".eslintrc.js",
    "jest.config.js",
    "env.config.js",
    "src",
    "app.d.ts",
  ]
}
```

This assumes you have a `src` folder and your build goes in `dist`, which is the best practice.

### 3. Add a Type Declaration file (app.d.ts)

Add a file named `app.d.ts` to the root of your MFE.  It should contain:

```
/// <reference types="@openedx/frontend-base" />
```

### 4. Edit `jest.config.js`

Replace the import from 'frontend-build' with 'frontend-base'.

### 5. Edit `.eslintrc.js`

Replace the import from 'frontend-build' with 'frontend-base'.

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
export default 'SvgrURL';
export const ReactComponent = 'SvgMock';
```

**file.js:**

```
module.exports = 'FileMock';
```

You can change the values of "SvgrURL", "SvgMock", and "FileMock" if you want to reduce changes necessary to your snapshot tests; the old values from frontend-build assume svg is only being used for icons, so the values referenced an "icon" which felt unnecessarily narrow.

This is necessary because we cannot write a tsconfig.json in MFEs that includes transpilation of the "config/jest" folder in frontend-base, it can't meaningfully find those files and transpile them, and we wouldn't want all MFEs to have to include such idiosyncratic configuration anyway.  The SVG mock, however, requires ESModules syntax to export its default and ReactComponent exports at the same time.  This means without moving the mocks into the MFE code, the SVG one breaks transpilation and doesn't understand the `export` syntax used.  By moving them into the MFE, they can be easily transpiled along with all the other code when jest tries to run.

### 9. SVGR "ReactComponent" imports have been removed.

We have removed the `@svgr/webpack` loader because it was incompatible with more modern tooling (it requires Babel).  As a result, the ability to import SVG files into JS as the `ReactComponent` export no longer works.  We know of a total of 5 places where this is happening today in Open edX MFEs - frontend-app-learning and frontend-app-profile use it.  Please replace that export with the default URL export and set the URL as the source of an `<img>` tag, rather than using `ReactComponent`.  You can see an example of normal SVG imports in `cli/test-app/src/App.jsx`.
