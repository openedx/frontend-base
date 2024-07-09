# Migrating frontend library code to frontend-base

## Summary

As part of an effort to reduce our overall dependency management burden, we've chosen to combine a number of libraries here into `frontend-base`.  This ADR describes how we will accomplish this, with special attention to the libraries' commit history.

## Context

[OEP-65: Frontend Composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html) necessitates a significant amount of changes to a number of our frontend libraries, including:

- [frontend-build](https://github.com/openedx/frontend-build)
- [frontend-platform](https://github.com/openedx/frontend-platform)
- [frontend-plugin-framework](https://github.com/openedx/frontend-plugin-framework)
- [frontend-component-header](https://github.com/openedx/frontend-component-header)
- [frontend-component-footer](https://github.com/openedx/frontend-component-footer)

As part of this process, we decided to unify these libraries to further reduce our dependency management overhead.  All of these libraries will be combined into this library, `frontend-base`.  In addition, we'll be adding a 'shell' application to this repository to act as the shell/top-level host application discussed in OEP-65.

At the time of this writing, the repository already contains `frontend-build`.

## Decision

We will move the code from these libraries into `frontend-base`.  We decided we wanted to preserve the commit history of these repositories as we add them to this repository, and found a relatively simple process for accomplishing this, as described below in "Commit History Preservation".

### Migration Order

We chose to move `frontend-build` first as the foundation upon which all the others will be built.  A modified version of `frontend-build` will be used to build the shell and provide build scripts to the frontend apps which support webpack module federation, amongst other things.

Following frontend build, we will move `frontend-platform` and validate that this repository can act as a replacement for `frontend-build` and `frontend-platform` together. At this point, micro-frontend repositories could be migrated to use this library instead of `frontend-build` and `frontend-platform`.

Once that has been proven, we'll add the other libraries and the 'shell' application in support of the new architecture described in OEP-65.

### Commit History Preservation

We created this repository by pushing the entire commit history from `frontend-build` into this repository.  This was accomplished by:

- Creating this new repository.
- Adding `openedx/frontend-build` as a remote.
- Pulling commits from `frontend-build/master` to `frontend-base/main` with a merge commit.
- Pushing those commits to the remote `frontend-base/main`.

This successfully preserved the commit history of `frontend-build`.  We will follow a similar pattern with the other repositories mentioned above.  Upon adding each repository, we will move its code "out of the way" into a sub-folder to reduce the likelihood of merge conflicts.

We acknowledge that this move will make it more difficult for GitHub, in particular, to track commit history through the move in its UI, but expect that it's far better than not having the history at all.

## Implementation

For `frontend-build`, the majority of its code is in:

- bin
- config
- lib

These folders should not, generally, conflict with the folders of the other libraries, and so can stay in place.  We have moved `lib` to `cli` and `config` to reduce ambiguity as other libraries are added.

The `example` sub-folder is problematic, as all of the other libraries contain their own `example` folders.  `frontend-build`'s example app has been moved to `test-app`.

The other libraries all contain `src` folders.  We will move each library to a sub-folder as it's added:

- `frontend-platform` will be moved to a `runtime` sub-folder.
- `frontend-plugin-framework`, once added, will be refactored into the same `runtime` folder.  The intention has always been that `frontend-platform` and `frontend-plugin-framework` would become the same library.
- `frontend-component-header` and `frontend-component-footer` will each be refactored into sub-folders of React components in a new `shell` folder, which itself represents the shell application for OEP-65.

Focusing on the libraries described in this ADR, we expect the final repository for `frontend-base` organization will be:

```
/frontend-base
  /bin  (frontend-build)
  /cli  (frontend-build)
  /docs (merged from all)
  /config (frontend-build)
  /runtime (frontend-platform, frontend-plugin-framework)
  /shell
    /header (frontend-component-header)
    /footer (frontend-component-footer)
  ... other folders...
```

### package.json and node_modules

The entire `frontend-base` repository will have a single package.json file and a single node_modules directory.  The only exception here will be the test apps ("example apps" in the current repositories), which will continue to act as independent applications.

### npm Package

The entire, unified library will be released as a single npm package, `@openedx/frontend-base`.
