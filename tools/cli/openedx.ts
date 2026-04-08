#!/usr/bin/env node
import chalk from 'chalk';

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { CommandTypes, ConfigTypes } from '../types';
import { ensureConfigFilenameOption } from './utils/ensureConfigFilenameOption';
import prettyPrintTitle from './utils/prettyPrintTitle';
import printUsage from './utils/printUsage';

// commandName is the third argument after node and 'openedx'
const commandName = process.argv[2];

// remove 'openedx' from process.argv to allow subcommands to read options properly
process.argv.splice(1, 1);

function getVersion(): string {
  // Read the version from package.json.  The compiled CLI lives at
  // dist/tools/cli/openedx.js, so the package root is always three levels up.
  const pkgJsonPath = path.resolve(__dirname, '../../../package.json');
  if (!existsSync(pkgJsonPath)) {
    return '(unknown)';
  }

  const { version: pkgVersion } = require(pkgJsonPath);
  if (!pkgVersion) {
    return '(unknown)';
  }

  if (!/^0\.0\.0-.+$/.test(pkgVersion)) {
    return pkgVersion;
  }

  // Placeholder version found — likely a local git checkout.  Append the
  // git hash so the exact checkout is identifiable.
  try {
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    return `${pkgVersion} (${hash})`;
  } catch {
    return pkgVersion;
  }
}

const version = getVersion();

prettyPrintTitle(`Open edX CLI v${version}`);

switch (commandName) {
  case CommandTypes.LINT:
    ensureConfigFilenameOption(ConfigTypes.LINT, ['-c', '--config']);
    require('.bin/eslint');
    break;
  case CommandTypes.TEST:
    ensureConfigFilenameOption(ConfigTypes.TEST, ['-c', '--config']);
    require('jest/bin/jest');
    break;
  case CommandTypes.BUILD:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_BUILD, ['-c', '--config']);
    require('webpack/bin/webpack');
    break;
  case CommandTypes.DEV:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_DEV, ['-c', '--config']);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case CommandTypes.DEV_SHELL:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_DEV_SHELL, ['-c', '--config']);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case CommandTypes.FORMAT_JS: {
    /* The include option is used to specify which additional source folders to extract messages from.
     * To extract more messages on other source folders use: --include=plugins --include=plugins2
     * The intention use case is to allow extraction from the 'plugins' directory on 'frontend-app-authoring'.
     * That plugins folder were kept outside the src folder to ensure they remain independent and
     * can function without relying on the MFE environment's special features.
     * This approach allows them to be packaged separately as NPM packages. */
    const additionalSrcFolders = [] as string[];
    process.argv.forEach((val, index) => {
      if (val.startsWith('--include=')) {
        additionalSrcFolders.push(val.split('=')[1]);
        process.argv.splice(index, 1);
      }
    });
    const srcFolders = ['src'].concat(additionalSrcFolders);
    let srcFoldersString = srcFolders.join(',');
    if (srcFolders.length > 1) {
      srcFoldersString = `{${srcFoldersString}}`;
    }
    process.argv = process.argv.concat([
      '--format', path.resolve(__dirname, './utils/formatter.js'),
      '--ignore', `${srcFoldersString}/**/*.json`,
      '--ignore', `${srcFoldersString}/**/*.d.ts`,
      '--out-file', './src/i18n/transifex_input.json',
      '--', `${srcFoldersString}/**/*.{j,t}s*`,
    ]);
    require('@formatjs/cli/bin/formatjs');
    break;
  }
  case CommandTypes.SERVE:
    require('./commands/serve');
    break;
  case CommandTypes.TRANSLATIONS_PULL:
    require('./commands/translations').runPull();
    break;
  case CommandTypes.TRANSLATIONS_PREPARE:
    require('./commands/translations').runPrepare();
    break;
  case CommandTypes.HELP:
    printUsage();
    break;
  default:
    console.log(`The command ${chalk.bold(commandName)} doesn't exist.`);
    console.log('');
    printUsage();
}
