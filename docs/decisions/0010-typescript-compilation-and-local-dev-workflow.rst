##########################################################################
Compile TypeScript before publishing and adopt tgz-based local development
##########################################################################

Summary
=======

We compile ``@openedx/frontend-base`` and ``@openedx/frontend-app-*`` packages
to JavaScript (with ``.d.ts`` declarations) before publishing to npm, and adopt
a tarball-based (``npm pack``) workflow as the official mechanism for local
development of said packages. As part of this, we remove support for
``module.config.js``-based local aliases.

Context
=======

The need for TypeScript compilation
------------------------------------

Previously, ``@openedx/frontend-base`` shipped raw TypeScript source and relied
on consumers' bundlers (webpack via ``ts-loader``) to transpile it at build
time. This worked, but prevented the use of TypeScript path aliases (e.g.,
``@src/*``) in consuming applications. Path aliases are resolved by ``tsc``
during compilation, and when a dependency ships raw TypeScript, its own aliases
leak into the consumer's build, where they cannot be resolved. By compiling to
JavaScript before publishing and using ``tsc-alias`` to resolve path aliases at
that stage, consumers are free to define and use their own aliases
independently.

The problem with module.config.js
-----------------------------------

``module.config.js`` was the previous mechanism for local development of
frontend dependencies. It worked by reading a configuration file at webpack
build time and creating ``resolve.alias`` entries to redirect imports to local
directories. While functional in simple cases, it had several problems:

1. **Webpack-only**: It only affected webpack's module resolution, so features
   that depend on Node.js resolution (such as TypeScript path aliases or
   ``tsc``-based compilation) were not supported.
2. **Brittle dependency resolution**: It attempted to second-guess npm's
   dependency resolution by manually resolving peer dependencies to the
   consumer's ``node_modules``. This not only side-stepped the deduplication
   that happens in production, but often broke things entirely with modern
   ``exports`` maps.
3. **Divergence from production**: The aliased resolution paths differed
   fundamentally from how dependencies resolve in a published package, violating
   the principle that development should mirror production as closely as
   possible.

Alternatives considered
-----------------------

- **``npm link``**: Does not work with the project's TypeScript configuration
  (``moduleResolution: "bundler"`` is incompatible with symlinked packages).
- **``yarn``, ``pnpm``, ``bun``**: Switching package managers would entail too
  many changes across the Open edX ecosystem for the benefit gained.
- **``yalc``**: A promising tool that wraps ``npm pack`` with push/watch
  semantics. It does what we need, but has not been actively maintained (last
  merge in 2023) and is missing features we would want (e.g., ``--peer`` flag).
  It remains a potential future option if it becomes actively maintained again or
  if we fork it.

Design principles
-----------------

The following principles guided this decision:

- **Closeness to production**: The development workflow should mirror production
  as closely as possible to minimize environment-specific bugs.
- **Resource optimization**: The workflow should not add unnecessary hoops.
  Developer time, system resources, and cognitive load should be minimized.
- **Consistency**: The same development workflow should work uniformly across all
  packages: ``frontend-base`` itself, consuming applications like
  ``frontend-app-authn``, third-party packages, and site configuration
  repositories.

Decision
========

1. **Compile TypeScript before publishing**: ``@openedx/frontend-base`` and all
   frontend-app-* repositories ship compiled JavaScript with ``.d.ts``
   declaration files, using export maps to define its public API. This enables
   consuming applications to also pre-compile their TypeScript and use path
   aliases.

2. **Remove ``module.config.js`` support**: The ``getLocalAliases()`` function
   and all references to ``module.config.js`` are removed from the webpack
   configurations and the codebase.

3. **Adopt tarball-based local development**: The official mechanism for local
   development of Open edX frontend dependencies is the ``npm pack`` /
   ``.tgz``-based workflow. The developer builds the dependency, packs it into a
   tarball, and the consuming project installs from that tarball.  Tooling to aid
   with this workflow will also be provided (details in the `Implementation`_
   section).

Implementation
==============

TypeScript compilation
----------------------

The package is compiled with ``tsc`` using ``tsconfig.build.json``, producing
JavaScript output and declaration files under ``/dist``. Path aliases are
resolved post-compilation with ``tsc-alias``. The npm ``exports`` map in
``package.json`` maps public entry points to their compiled locations.

At the bundler level, we add ``tsconfig-paths-webpack-plugin`` to the default
webpack configurations so that TypeScript path aliases are also respected by
webpack builds (including during ``npm run dev``) without duplicating their
definitions.

As part of this change, we unify the TypeScript build outputs under ``/dist``
and use npm export maps to decouple the internal file structure from the
package's public API.

Local development workflow
--------------------------

To develop a local dependency (e.g., ``@openedx/frontend-base``) against a
consuming project:

1. In the dependency: ``npm run build`` (or use a watcher like ``nodemon`` with
   ``npm run pack:local``)
2. In the consumer: install from the tarball and run the dev server (or use the
   `autoinstall tool`_ from the ``frontend-dev-utils`` package)

This approach is consistent across all package types and faithfully reproduces
production resolution semantics, since ``npm pack`` produces the same artifact
that ``npm publish`` would.

The ``test-site`` project contains reference tooling that automates detecting
new tarballs and reinstalling them during development.

.. _autoinstall tool: https://github.com/openedx/frontend-dev-utils/blob/main/tools/autoinstall/README.md
