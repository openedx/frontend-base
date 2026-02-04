# cli

This directory contains the `transifex-utils.js` and `intl-imports.js` files which are shared across all micro-frontends.

The package.json of `frontend-base` includes the following sections:

```
  "bin": {
    "intl-imports.js": "dist/tools/cli/intl-imports.js",
    "openedx": "dist/tools/cli/openedx.js",
    "transifex-utils.js": "dist/tools/cli/transifex-utils.js"
  },
```

This config block causes the scripts to be copied to the following path when `frontend-base` is installed as a
dependency of a micro-frontend:

```
/node_modules/.bin/intl-imports.js
/node_modules/.bin/openedx
/node_modules/.bin/transifex-utils.js
```

All micro-frontends have a `Makefile` with a line that loads the scripts from the above path:

```
intl_imports = ./node_modules/.bin/intl-imports.js
transifex_utils = ./node_modules/.bin/transifex-utils.js
```

So if you delete either of the files or the `cli` directory, you'll break all micro-frontend builds. Happy coding!
