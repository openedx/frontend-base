#!/usr/bin/env node
import chalk from 'chalk';

import { existsSync } from 'fs';
import path from 'path';
import { CommandTypes, ConfigTypes } from '../types';
import pack from './commands/pack';
import release from './commands/release';
import { ensureConfigFilenameOption } from './utils/ensureConfigFilenameOption';
import prettyPrintTitle from './utils/prettyPrintTitle';
import printUsage from './utils/printUsage';

// commandName is the third argument after node and 'openedx'
const commandName = process.argv[2];

// remove 'openedx' from process.argv to allow subcommands to read options properly
process.argv.splice(1, 1);

let version;

if (existsSync(path.resolve(__dirname, '../../package.json'))) {
  version = require('../../package.json').version;
} else if (existsSync(path.resolve(__dirname, '../../../package.json'))) {
  version = require('../../../package.json').version;
}

prettyPrintTitle(`Open edX CLI v${version}`);

switch (commandName) {
  case CommandTypes.RELEASE:
    release();
    break;
  case CommandTypes.PACK:
    if (process.argv[2] === undefined) {
      console.log(chalk.red(`${chalk.bold.red(commandName)} command usage: specify a peer folder where the command should install the package:

      npm run pack my-project`));
      process.exit(1);
    }
    pack();
    break;
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
      '--format', 'node_modules/@openedx/frontend-base/tools/dist/cli/utils/formatter.js',
      '--ignore', `${srcFoldersString}/**/*.json`,
      '--ignore', `${srcFoldersString}/**/*.d.ts`,
      '--out-file', './temp/formatjs/Default.messages.json',
      '--', `${srcFoldersString}/**/*.{j,t}s*`,
    ]);
    require('@formatjs/cli/bin/formatjs');
    break;
  }
  case CommandTypes.SERVE:
    require('./commands/serve');
    break;
  case CommandTypes.HELP:
    printUsage();
    break;
  default:
    console.log(`The command ${chalk.bold(commandName)} doesn't exist.`);
    console.log('');
    printUsage();
}
