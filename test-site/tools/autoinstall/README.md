# Developing an app and `frontend-base` concurrently

## Why this workflow exists

When developing an application alongside `frontend-base`, the usual approaches for working on a dependency locally, such as `file:` dependencies, `npm link`, and webpack module configuration, proved unreliable.

In multiple cases:

* the consuming application would surface **TypeScript errors inside `frontend-base` source files**
* those same errors would **disappear entirely** when `frontend-base` was installed from a packaged tarball
* this behavior persisted even when extracting the tarball and linking the extracted directory directly

Changing *how* `frontend-base` was introduced into the app (without changing any code) eliminated the TypeScript errors.

This made it clear that symlink and source-based workflows were interacting poorly with TypeScript and build tooling, even when the underlying code was identical.

## What this workflow does instead

The tooling in this directory treats `frontend-base` as a packaged dependency during local development.

* `frontend-base` is built using `npm pack`
* the consuming application installs the resulting `.tgz`
* changes trigger a reinstall and dev server restart

This mirrors how `frontend-base` is actually consumed from npm, and avoids the TypeScript and tooling issues encountered with linking approaches.
