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

### 4. Edit package.json `scripts`

Replace all instances of `fedx-scripts` with `openedx` in your package.json file.

> [!TIP]
> **Why change `fedx-scripts` to `openedx`?**
> A few reasons.  One, the Open edX project shouldn't be using the name of an internal community of practice at edX for its frontend tooling.  Two, some dependencies of your MFE invariably still use frontend-build for their own build needs.  This means that they already installed `fedx-scripts` into your `node_modules/.bin` folder.  Only one version can be in there, so we need a new name.  Seemed like a great time for a naming refresh. |

### 5. Add a tsconfig.json file

Create a tsconfig.json file and add the following contents to it:

```
{
  "extends": "@openedx/frontend-base/config/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": [
    "src"
  ]
}
```

This assumes you have a `src` folder and your build goes in `dist`, which is the best practice.

### 6. Edit `jest.config.js`

Replace the import from 'frontend-build' with 'frontend-base'.

### 7. Edit `.eslintrc.js`

Replace the import from 'frontend-build' with 'frontend-base'.

### 8. Search for any other usages of `frontend-build`

Find any other imports/usages of `frontend-build` in your repository and replace them with `frontend-base` so they don't break.
