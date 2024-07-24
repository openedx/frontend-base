# Modernizing JavaScript transpilation

## Summary

In the process of migrating our build code from `frontend-build` to `frontend-base`, we have replaced `babel-loader` and `browserslist` with `ts-loader` and `tsconfig.json` in order to simplify and modernize our JavaScript transpilation process.

## Context

In the past, we used `babel-loader`, `@babel/preset-env` to transpile our JavaScript to a version supported by the browsers specified in `@edx/browserslist-config`.  Our browserslist configuration (at the time of this writing) specifies recent versions of evergreen browsers.

This means that Babel is likely doing very little for us since our supported browsers are all very modern.  Meanwhile, we're also trying to add TypeScript support to the Open edX frontend, and have an expectation that `babel-loader` is one of the slower ways to transpile code in webpack, behind both `ts-loader` and `swc-loader`.

Further, we're trying to simplify our dependency tree and reduce our bundle size, and believe the Babel-related dependencies in `frontend-build` are a source of unnecessary bloat.

The one important exception are Jest tests.  The Jest configuration still relies on Babel because `ts-jest` is not a full-featured alternative to `babel-jest`.  It lacks the flexibility to transpile code from node_modules dependencies in all of the various ways they might be configured.  It fails to work properly for ES6 code in certain situations in our dependencies.  A notable example is the `icons` folder in `@openedx/paragon` - `ts-jest` is completely unable to process those files and fails.  Because of this, we need to keep a few Babel dependencies around to support Jest.

## Decision

As part of migrating to `frontend-base`, we chose to simplify and modernize our build process.  We've accomplished this by replacing `babel-loader` in our webpack configurations with `ts-loader`.  We will then remove all the Babel-related dependencies from the library that aren't needed by Jest.  Anecdotally, we expect this will reduce build times by at least 2-3 seconds and reduce this library's dependencies by roughly 100MB.

In migrating from `babel-loader` and `@edx/browserslist-config` to `ts-loader` and `tsconfig.json`, how we calculate our transpilation targets has changed a bit.  We believe this is acceptable given how up-to-date and modern our target browsers are.  Rather than targeting browser versions, we target a particular version of JavaScript sufficiently 'old' that our supported browsers are guaranteed to support it.  In order to update this target in the future, we will need to evaluate and understand what JavaScript language features are supported by recent versions of evergreen browsers.

## Implementation

### Transpilation targets

In `frontend-build`'s transpilation process, we use `@edx/browserslist-config` and `@babel/preset-env` to determine our target JavaScript language features.  The Browserslist config looks like:

```
const desktop = [
  'last 2 Chrome major versions',
  'last 2 Firefox major versions',
  'last 2 Safari major versions',
  'last 2 Edge major versions',
];

const mobile = [
  'last 3 ChromeAndroid major versions',
  'last 3 FirefoxAndroid major versions',
  'last 3 iOS major versions',
];
```

We also added three Babel plugins to explicitly support several language features (that, in modern browsers, are all 100% supported):

- `@babel/plugin-proposal-class-properties`
- `@babel/plugin-proposal-object-rest-spread`
- `@babel/plugin-syntax-dynamic-import`

We have replaced these with the following tsconfig.json option (file edited down to pertinent config options):

```
{
  "compilerOptions": {
    "target": "ES6",
  },
}
```

The "target" describes the JavaScript language version emitted by the transpilation process.  A value of "ES6" is considered safe.  The TypeScript documentation states:

> Modern browsers support all ES6 features, so ES6 is a good choice.

As related evidence, `create-react-app` TypeScript projects, for instance, set the target to "ES5" to be extremely conservative and support as many platforms as possible.  Given our supported browsers as described in our Browserslist config, we don't need to be as conservative.

### Dependencies

We have removed these dependencies:

- `@babel/cli`
- `@babel/eslint-parser`
- `@babel/plugin-proposal-class-properties`
- `@babel/plugin-proposal-object-rest-spread`
- `@babel/plugin-syntax-dynamic-import`
- `@types/jest`
- `babel-loader`
- `babel-plugin-transform-imports`
- `babel-polyfill`

We have retained these Babel-related dependencies:

- `@babel/core`
- `@babel/preset-env`
- `@babel/preset-react`
- `@babel/preset-typescript`
- `babel-jest`
- `babel-plugin-formatjs`


We have added these dependencies:

- `ts-loader`
- `@formatjs/ts-transformer`

### Other notable changes

- We've removed the `babel` CLI command, as it's no longer necessary and to our knowledge nothing is using it.
- We've removed `babel-preserve-modules.config.js` which is in use by some libraries that use `frontend-build`.  It's our expectation that these libraries should be moving toward a using `tsc` for their build process where they rely on their consumer to run a webpack build, rather than doing it themselves.  Our Open edX libraries are currently double-transpiling; once as part of their own build process and once by the consuming app or library.  It's wasteful and unnecessary.
- The formatjs process no longer relies on Babel, and functions without it.
