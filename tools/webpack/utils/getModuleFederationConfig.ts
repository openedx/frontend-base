import path from 'path';

export default function getModuleFederationConfig() {
  const packageJson = require(path.resolve(process.cwd(), 'package.json'));

  if (!packageJson.config?.name || !packageJson.config.exposes) {
    console.error('Could not find a build configuration in a build.dev.config.js file or in package.json. Is this repository an Open edX app that can be deployed via module federation? Aborting.');
    process.exit(1);
  }

  return packageJson.config;
}
