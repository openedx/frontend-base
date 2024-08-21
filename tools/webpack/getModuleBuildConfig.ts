import { existsSync } from 'fs';
import path from 'path';

export default function getModuleBuildConfig(filename: string) {

  const packageJson = require(path.resolve(process.cwd(), 'package.json'));

  const buildConfigPath = path.resolve(process.cwd(), filename);
  let buildConfig = {
    modules: [],
    exposes: {},
    name: '',
  };

  function abortWithMessage(message: string) {
    console.error(message);
    process.exit(1);
  }

  if (existsSync(buildConfigPath)) {
    // This is a project build.
    buildConfig = require(buildConfigPath);

    if (!Array.isArray(buildConfig.modules)) {
      abortWithMessage(`${filename} must include an array of modules identified by package name. Aborting.`);
    }

    buildConfig.modules.forEach((moduleName: string) => {
      const modulePackageJsonPath = path.resolve(process.cwd(), 'node_modules', moduleName, 'package.json');
      if (!existsSync(modulePackageJsonPath)) {
        abortWithMessage(`Package ${moduleName} is not a dependency of this project.  Have you installed it in node_modules?`);

      }
      const modulePackageJson = require(modulePackageJsonPath);
      if (modulePackageJson.config === undefined || modulePackageJson.config.name === undefined || modulePackageJson.config.exposes === undefined) {
        abortWithMessage(`Package ${moduleName} does not include a 'name' or 'exposes' config. Is it an Open edX app that can be deployed via module federation? Aborting.`);
      }

      buildConfig.exposes = {
        ...buildConfig.exposes,
        ...modulePackageJson.config.exposes
      };
    });
  } else if (packageJson.config.name !== undefined && packageJson.config.exposes !== undefined) {
    // This is a 'self' build.
    buildConfig = packageJson.config;
  } else {
    abortWithMessage('Could not find a build configuration in a build.dev.config.js file or in package.json. Is this repository an Open edX app that can be deployed via module federation? Aborting.');
  }

  return buildConfig;
}
