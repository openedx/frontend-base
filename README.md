# Open edX frontend framework

This library is part of a project to create a reference implementation of [OEP-65: Frontend Composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html).

In practice, it's a replacement for some of the foundational libraries in the Open edX frontend.  In particular:

- https://github.com/openedx/frontend-build
- https://github.com/openedx/frontend-platform
- https://github.com/openedx/frontend-plugin-framework
- https://github.com/openedx/frontend-component-header
- https://github.com/openedx/frontend-component-footer

It takes over responsibility for the functionality of those libraries, and also includes a "shell" application.

Furthermore, it enables Open edX frontends to be loaded as "direct plugins" as part of a single, unified application, while also supporting creation of "site" repositories as a central place to check in an Open edX instance's frontend customizations and extensions.

## Migrating an MFE to `frontend-base`

For a step-by-step guide on converting an MFE into a frontend-base app, refer to the [Frontend App Migration How To](./docs/how_tos/migrate-frontend-app.md).  It is the authoritative reference on the conversion process.

Note that the existing Open edX MFEs are being ported over to `frontend-base` gradually.  For an up-to-date reference of the apps that have already undergone the process, see the app dependencies in [`frontend-template-site`'s `package.json`](https://github.com/openedx/frontend-template-site/blob/main/package.json).

## Development

For prototyping changes to the library, this repository includes a self-contained dev mode.  Run `npm run dev` to build `frontend-base` and start its bundled dev shell, which serves a minimal site from the source files directly, so you can iterate without a separate site checkout.  The dev site will be available at `http://apps.local.openedx.io:8080`.

Once the change matures, we recommend moving over to the pre-configured [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) in a local checkout of [frontend-template-site](https://github.com/openedx/frontend-template-site).  This will allow you to test changes against multiple real-world apps.

To do so, check this repository out into the site's `packages/` directory.  Then, run `npm run dev:packages` from the site's root directory: this will watch-build any workspace check-outs and start the dev server, picking up changes automatically.  If any apps (such as `frontend-app-instructor-dashboard`) require corresponding changes, you can check them out into the `packages/` directory as siblings to `frontend-base`. See [Local development with workspaces](https://github.com/openedx/frontend-template-site#local-development-with-workspaces) for full setup details.

### Continuous integration

In addition to running lint and the test suite, Github CI builds the included `test-site` against a packed tarball of `frontend-base`.  This verifies that the library still works end-to-end as a real dependency of a consuming site.

If a change requires corresponding updates to a consuming site (for example, new or changed configuration, exports, or APIs), update `test-site` as part of your pull request so that CI continues to pass.

### Releases

This library is published automatically to npm using `semantic-release`.  On merges to `main`, `alpha` versions are published.  Stable releases come from the `release` branch.  See [ADR 0012: Frontend branching strategy](./docs/decisions/0012-frontend-branching-strategy.rst) for details.

## Further reading

- [OEP-65: Frontend composability](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065-arch-frontend-composability.html)
- [ADR 0001: Create a unified platform repository](https://open-edx-proposals.readthedocs.io/en/latest/architectural-decisions/oep-0065/decisions/0001-unified-platform-repository.html)

## Communication

You can follow ongoing progress on the project's [Github project board](https://github.com/orgs/openedx/projects/65/views/1).

Feel free to reach out in [#wg-frontend on Slack](https://openedx.slack.com/archives/C04BM6YC7A6) with any questions.
