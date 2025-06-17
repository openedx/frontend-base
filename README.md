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

It will enable Open edX frontends to be loaded as "direct plugins" as part of a single, unified application.   It will also support creation of "project" repositories as a central place to check in an Open edX instance's frontend customizations and extensions.

## Further reading

- [OEP-65: Frontend composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html)
- [ADR 0001: Create a unified platform library](https://github.com/openedx/open-edx-proposals/pull/598)
- [Discourse discussion on frontend projects](https://discuss.openedx.org/t/oep-65-adjacent-a-frontend-architecture-vision/13223)

## Communication

You can follow ongoing progress on the project's [Github project board](https://github.com/orgs/openedx/projects/65/views/1).

Feel free to reach out in [#wg-frontend on Slack](https://openedx.slack.com/archives/C04BM6YC7A6) with any questions.

## Development

This library is under development and has not yet been published to npm.

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

- frontend-build            - Up to date as of 9/12/2024
- frontend-platform         - Up to date as of 9/13/2024
- frontend-plugin-framework - Up to date as of 9/13/2024
- frontend-component-header - Up to date as of 9/12/2024
- frontend-component-footer - Up to date as of 9/12/2024

# Other notable changes

- Cease using `AUTHN_MINIMAL_HEADER`, replace it with an actual minimal header.
- No more using `process.env` in runtime code.
- Removed dotenv.  Use site.config.tsx.
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

# Working with Tutor

In order to use tutor with frontend-base, you need to create a tutor plugin which patches some of the LMS's development settings.

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
MFE_CONFIG = {
  # override MFE CONFIG values appropriate to the shell, if necessary
}
"""
    )
)
```

Customizing the MFE config API:

https://github.com/overhangio/tutor-mfe?tab=readme-ov-file#customising-mfes

Creating a Tutor plugin:

https://docs.tutor.edly.io/tutorials/plugin.html

Adding new MFEs:

https://github.com/overhangio/tutor-mfe?tab=readme-ov-file#adding-new-mfes
