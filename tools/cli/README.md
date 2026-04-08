# cli

This directory contains the `openedx` CLI which is shared across all sites and micro-frontends.

The package.json of `frontend-base` includes the following section:

```
  "bin": {
    "openedx": "dist/tools/cli/openedx.js"
  },
```

This config block causes the CLI to be available at the following path when `frontend-base` is installed as a
dependency of a site or micro-frontend:

```
/node_modules/.bin/openedx
```
