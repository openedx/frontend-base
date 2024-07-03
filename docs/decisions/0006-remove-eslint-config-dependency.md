# Removing dependency on @edx/eslint-config

## Summary

We chose to remove `frontend-base`'s dependency on `@edx/eslint-config` so that we could iterate on it, simplify it, and modernize it independently.

## Context

As part of the creation of `frontend-base` as a unified platform library for the frontend, we have been considering pulling `@edx/eslint-config` into the repository since the beginning.  There's some question about whether there's value in it being a standalone package, as it allows other libraries to use it without pulling in the rest of `frontend-base`.

Meanwhile, we're modernizing the tooling in `frontend-base` and adding full TypeScript support, and in the process of doing this it's likely that our eslint config could be simplified and modernized as well.

We expect migration to `frontend-base` to involve some breaking changes already, and believe that pulling the ESLint config into that process is a reasonable choice.

## Decision

We will remove the dependency on `@edx/eslint-config` by copying the configuration file into `frontend-base`'s `config/.eslintrc.js` file.  This repository already has all the correct dependencies because they were peer dependencies in `@edx/eslint-config`.

## Implementation

We run `npm uninstall @edx/eslint-config` and copy the ESLint configuration from that repository into `config/.eslintrc.js`.  Everything else will continue to work as-is.
