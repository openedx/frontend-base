// Keep this here, checked in to the repository.  module.config.js files normally aren't checked in,
// but this one is.

// This module.config.js serves two purposes.  One, it tests the module.config.js and local alias
// mechanism.  Two, it's an important piece of configuration for this test-app in a sub-directory of
// the actual frontend-base library.  This fakes webpack out so that it believes frontend-base is
// a normal module.  Without this, webpack and ts-loader resolve the symlinks in test-app/node_modules to their actual locations in the parent directory, and then the build fails because the files are outside the TypeScript project.
module.exports = {
  localModules: [
    { moduleName: '@openedx/frontend-base', dir: '..', dist: 'dist' },
  ],
};
