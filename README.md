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

- [Frontend Glossary](./docs/frontend-glossary.md)
- [OEP-65: Frontend composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html)
- [ADR 0001: Create a unified platform library](https://github.com/openedx/open-edx-proposals/pull/598)
- [Discourse discussion on frontend projects](https://discuss.openedx.org/t/oep-65-adjacent-a-frontend-architecture-vision/13223)

## Communication

This project uses the [#module-federation](https://openedx.slack.com/archives/C06HRLTP3E0) channel in Open edX Slack.

You can follow ongoing progress on the project's [Github project board](https://github.com/orgs/openedx/projects/65/views/1).

Feel free to reach out to David Joy ([Github](https://github.com/davidjoy), [Slack](https://openedx.slack.com/team/UFM4FEN0J)) with any questions.

## Development

This library is under development and has not yet been published to npm.

Its functionality can be tested with a few other companion repositories that have been built to work with it:

- https://github.com/davidjoy/frontend-app-base-test
- https://github.com/davidjoy/frontend-project-test
- https://github.com/davidjoy/frontend-project-module-test

To start the whole thing together:

- Check out https://github.com/davidjoy/frontend-base and the above three repositories as siblings.
- Run `npm install` on all of them.
- Run `npm run temp:refresh-all` in frontend-base.
- Run `npm run pack frontend-project-test` in frontend-app-base-test.
- Run `npm run pack frontend-project-module-test` in frontend-app-base-test.
- You'll need 3 terminal windows.
  - Run `npm run dev` in `frontend-project-test`
  - Run `npm run dev:module` in `frontend-app-base-test`
  - Run `npm run dev:module` in `frontend-project-module-test
- Visit `http://localhost:8080` in your browser to see the unified site.

What this site is showing you:

- The shell (header, footer, app initialization) is being loaded from `frontend-base` through `frontend-project-test`.  The `site.config.dev.tsx` file in `frontend-project-test` has configured the site.
- `ModuleOne` from `frontend-app-base-test` is being loaded _through_ the `site.config.dev.tsx` file in `frontend-project-test` as an imported dependency.
- `ModuleTwo` is being loaded at runtime from the module federation dev server in `frontend-app-base-test`.
- `ModuleThree` is being loaded at runtime from the module federation dev server in `frontend-project-module-test`.

Read below for more details about the companion repositories.

### frontend-app-base-test

https://github.com/davidjoy/frontend-app-base-test

This is an "MFE" repository with three modules in it which can be loaded into a shell.  It can be tested in a few different ways.

- `npm run dev:module` - This will run a dev server and build the app as modules for module federation.
- `npm run dev` - This will run the a dev server and build the app as part of a shell with three imported modules.
- `npm run pack <frontend-project-test|frontend-project-module-test>` - this will package the library into an npm compatible `.tgz` file for use with the project repositories below.

### frontend-project-test

This is a "project" repository, which is a new thing.  A project is where you put your customizations to the frontend.

The `frontend-project-test` project has been configured in its `site.config.dev.tsx` file to load the three modules from `frontend-app-base-test` in three different ways:

- Module One is loaded as an imported app, using frontend-app-base-test as a dependency of the project installed via `npm run pack` above.
- Module Two is loaded via module federation from the `npm run dev:module` dev server in `frontend-app-base-test`
- Module Three is loaded via module federation from the `npm run dev:module` dev server in `frontend-project-module-test`.

It can be tested with:

- `npm run dev` - This will start up a dev server with the new shell application and load the three modules into it via the methods described above.

### frontend-project-module-test

This is also a "project" repository, demonstrating that you can use module federation with a released library version of `frontend-app-base-test`, rather than by cloning the app and running a dev server in it.  This is more appropriate for customizations of the app because you can check all your customizations in to the project, rather than needing to copy/paste them into the frontend-app-* repository at build time, which is awkward.

It can be tested with:

- `npm run dev:module` - This starts up a dev server that serves the modules from `frontend-app-base-test` for module federation, the same as running `npm run dev:module` in the `frontend-app-base-test` repository itself.

It's worth noting that this project has a new type of file: `build.dev.config.js` which is necessary to configure webpack to understand what modules it should be packaging for module federation.  We can't use `site.config.dev.tsx` for this purpose, since that's runtime code.

## Migrating an MFE to `frontend-base` (Work in progress)

See the [Frontend App Migration How To](./docs/how_tos/migrate-frontend-app.md).

## Merging repositories

Followed this process: https://stackoverflow.com/questions/13040958/merge-two-git-repositories-without-breaking-file-history

After adding a remote of the repo to merge in, run this command:

```
git merge other-repo-remote/master --allow-unrelated-histories
```

Then work through the conflicts and use a merge commit to add the history into the frontend-base.

Then move the files out of the way (move src to some other sub-dir, mostly) to make room for the next repo.

### Latest repository merges

- frontend-component-header - Up to date as of 9/12/2024
- frontend-component-footer - Up to date as of 9/12/2024
- frontend-build            - Up to date as of 9/12/2024

- frontend-platform         - Up to date as of 9/13/2024
- frontend-plugin-framework - Up to date as of 9/13/2024

# Other notable changes

- Cease using `AUTHN_MINIMAL_HEADER`, replace it with an actual minimal header.
- No more using `process.env` in runtime code.
- `SUPPORT_URL` is now optional and the support link in the header is hidden if it's not present.
- Removed dotenv.  Use site.config.tsx.
- Removed Purge CSS.  We do not believe that Purge CSS works properly with Paragon in general, and it is also fundamentally incompatible with module federation as an architecture.
- Removed `ensureConfig` function.  This sort of type safety should happen with TypeScript types in the site config file.
- Removed `ensureDefinedConfig` function.  Similar to ensureConfig, this sort of type safety should be handled by TypeScript.
- A number of site config variables now have sensible defaults:
  - ACCESS_TOKEN_COOKIE_NAME: 'edx-jwt-cookie-header-payload',
  - CSRF_TOKEN_API_PATH: '/csrf/api/v1/token',
  - LANGUAGE_PREFERENCE_COOKIE_NAME: 'openedx-language-preference',
  - USER_INFO_COOKIE_NAME: 'edx-user-info',
  - PUBLIC_PATH: '/',
  - ENVIRONMENT: 'production',
- the `basename` and `history` exports have been replaced by function getters: `getBasename` and `getHistory`.  This is because it may not be possible to determine the values of the original constants at code initialization time, since our config may arrive asynchronously.  This ensures that anyone trying to get these values gets a current value.
- When using MockAuthService, set the authenticated user by calling setAuthenticatedUser after instantiating the service.  It's not okay for us to add arbitrary config values to the site config.
- `REFRESH_ACCESS_TOKEN_ENDPOINT` has been replaced with `REFRESH_ACCESS_TOKEN_API_PATH`.  It is now a path that defaults to '/login_refresh'.  The Auth service assumes it is an endpoint on the LMS, and joins the path with `LMS_BASE_URL`.  This change creates more parity with other paths such as `CSRF_TOKEN_API_PATH`.
- `ENABLE_ACCESSIBILITY_PAGE` has been renamed `ACCESSIBILITY_URL` and is now the URL to an accessibility page.
