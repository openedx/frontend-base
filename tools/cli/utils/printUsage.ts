import chalk from 'chalk';

export default function printUsage() {
  console.log('CLI Usage:\n');

  console.group();
  console.log('openedx <command> <options>\n');
  console.groupEnd();

  console.log('Commands:\n');

  console.group();
  console.log(`${chalk.bold('release')}\n`);
  console.group();
  console.log(`Compile source code for release as a library.  Compiled code is put into the dist folder.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('pack')} <peer folder>\n`);
  console.group();
  console.log(`Package the dist folder as an NPM-compatible .tgz file suitable for use with npm install, then install it in the specified peer folder.  The folder is assumed to be a peer of this repository, do not include a path.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('lint')} <eslint options>\n`);
  console.group();
  console.log(`Runs ESLint on the source code. Requires an ${chalk.bold('eslint.config.js')} file.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('test')} <jest options>\n`);
  console.group();
  console.log(`Runs Jest on the source code test suite. Requires a ${chalk.bold('jest.config.js')} file.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('build')}\n`);
  console.group();
  console.log(`Compiles the source code for deployment as a frontend site.  Requires a ${chalk.bold('site.config.build.tsx')} file.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('dev')}\n`);
  console.group();
  console.log(`Compiles the source code and serves it in Webpack dev server as a frontend site. Requires a ${chalk.bold('site.config.dev.tsx')} file.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('formatjs')}\n`);
  console.group();
  console.log(`Runs formatjs on the source code to extract internationalization messages.\n`);
  console.groupEnd();

  console.log(`${chalk.bold('serve')}\n`);
  console.group();
  console.log(`Serves the dist folder with an express server.  Used to locally test production assets.\n`);
  console.groupEnd();
  console.groupEnd();
}
