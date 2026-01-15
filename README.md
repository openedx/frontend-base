# Open edX frontend framework

| :rotating_light: Alpha                                                                |
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

It will enable Open edX frontends to be loaded as "direct plugins" as part of a single, unified application.   It will also support creation of "project" repositories as a central place to check in an Open edX instance's frontend customizations and extensions.

## Further reading

- [OEP-65: Frontend composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html)
- [ADR 0001: Create a unified platform library](https://github.com/openedx/open-edx-proposals/pull/598)
- [Discourse discussion on frontend projects](https://discuss.openedx.org/t/oep-65-adjacent-a-frontend-architecture-vision/13223)

## Communication

You can follow ongoing progress on the project's [Github project board](https://github.com/orgs/openedx/projects/65/views/1).

Feel free to reach out in [#wg-frontend on Slack](https://openedx.slack.com/archives/C04BM6YC7A6) with any questions.

## Development

This library is under development and for now is released manually to npm.

### Developing with Tutor

In order to use develop frontend-base with Tutor, you need to create a Tutor plugin which patches some of the LMS's development settings.

```
from tutormfe.hooks import MFE_APPS, MFE_ATTRS_TYPE

from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
  (
    "openedx-lms-development-settings",
    """
CORS_ORIGIN_WHITELIST.append("http://{{ MFE_HOST }}:8080")
LOGIN_REDIRECT_WHITELIST.append("http://{{ MFE_HOST }}:8080")
CSRF_TRUSTED_ORIGINS.append("http://{{ MFE_HOST }}:8080")
"""
    )
)
```

Once you enable this plugin, you can start the development site with:

```
nvm use
npm ci
npm run dev
```

The development site will be available at `http://apps.local.openedx.io:8080`.

### Developing an app and `frontend-base` concurrently

Concurrent development with `frontend-base` uses a tarball-based workflow rather than traditional local linking approaches. See [test-site/tools/autoinstall/README.md](./test-site/tools/autoinstall/README.md) for details.

#### In `frontend-base`

This watches for changes in `frontend-base` and rebuilds the packaged tarball on each change.

```sh
nvm use
npm ci
npm run dev:pack
```

#### In the consuming application

> [!NOTE]
> This assumes the consuming application has the same tooling as [test-site/tools/autoinstall/](./test-site/tools/autoinstall/)

This watches for changes to the generated .tgz, installs the updated package, and restarts the dev server.

```sh
nvm use
npm ci
npm run dev:autoinstall
```

## Migrating an MFE to `frontend-base`

See the [Frontend App Migration How To](./docs/how_tos/migrate-frontend-app.md).

# Notable changes

This is a list of notable changes from the previous paradigm:

- Cease using `AUTHN_MINIMAL_HEADER`, replace it with an actual minimal header.
- No more using `process.env` in runtime code.
- Removed dotenv.  Use `site.config.*.tsx`.
- Removed Purge CSS.  We do not believe that Purge CSS works properly with Paragon in general.
- Removed `ensureConfig` function.  This sort of type safety should happen with TypeScript types in the site config file.
- Removed `ensureDefinedConfig` function.  Similar to ensureConfig, this sort of type safety should be handled by TypeScript.
- A number of site config variables now have sensible defaults:
  - accessTokenCookieName: 'edx-jwt-cookie-header-payload',
  - csrfTokenApiPath: '/csrf/api/v1/token',
  - languagePreferenceCookieName: 'openedx-language-preference',
  - userInfoCookieName: 'edx-user-info',
  - environment: 'production',
- the `basename` and export has been replaced by: `getBasename`.  This is because it may not be possible to determine the values of the original constants at code initialization time, since our config may arrive asynchronously.  This ensures that anyone trying to get these values gets a current value.
- the `history` export no longer exists.  Consumers should be using react-router 6's `useNavigate()` API instead.
- When using MockAuthService, set the authenticated user by calling setAuthenticatedUser after instantiating the service.  It's not okay for us to add arbitrary config values to the site config.
- `REFRESH_ACCESS_TOKEN_ENDPOINT` has been replaced with `refreshAccessTokenApiPath`.  It is now a path that defaults to '/login_refresh'.  The Auth service assumes it is an endpoint on the LMS, and joins the path with `lmsBaseUrl`.  This change creates more parity with other paths such as `csrfTokenApiPath`.

The following config variables have been removed, in favor of defining roles for specific modules, `externalRoutes`, or app-specific custom config as necessary:

- ACCOUNT_PROFILE_URL
- ACCOUNT_SETTINGS_URL
- LEARNING_BASE_URL
- ORDER_HISTORY_URL
- MARKETING_SITE_BASE_URL
- LEARNER_DASHBOARD_URL
- STUDIO_BASE_URL
- ACCESSIBILITY_URL
- PRIVACY_POLICY_URL
- TERMS_OF_SERVICE_URL
- SUPPORT_URL
- SUPPORT_EMAIL
- ECOMMERCE_BASE_URL
- DISCOVERY_API_BASE_URL
- CREDENTIALS_BASE_URL
- PUBLISHER_BASE_URL
