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
  case CommandTypes.BUILD_MODULE:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_BUILD_MODULE, ['-c', '--config']);
    require('webpack/bin/webpack');
    break;
  case CommandTypes.DEV_LEGACY:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_DEV_LEGACY, ['-c', '--config']);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case CommandTypes.DEV_MODULE:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_DEV_MODULE, ['-c', '--config']);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case CommandTypes.DEV_SHELL:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_DEV_SHELL, ['-c', '--config']);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case CommandTypes.DEV:
    ensureConfigFilenameOption(ConfigTypes.WEBPACK_DEV, ['-c', '--config']);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case CommandTypes.FORMAT_JS:
    const commonArgs = [
      '--format', 'node_modules/@openedx/frontend-base/dist/tools/cli/utils/formatter.js',
      '--ignore', 'src/**/*.json',
      '--out-file', './temp/formatjs/Default.messages.json',
      '--', 'src/**/*.js*',
    ];
    process.argv = process.argv.concat(commonArgs);
    require('@formatjs/cli/bin/formatjs');
    break;
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
