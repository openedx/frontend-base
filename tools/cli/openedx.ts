#!/usr/bin/env node
import chalk from 'chalk';

import { existsSync } from 'fs';
import path from 'path';
import presets from '../config-helpers/presets';
import { ConfigPreset, ConfigPresetTypes } from '../types';
import pack from './commands/pack';
import release from './commands/release';
import prettyPrintTitle from './utils/prettyPrintTitle';
import printUsage from './utils/printUsage';

/**
 * TLDR:
 *  - Find the command to be run in process.argv
 *  - Remove 'openedx' in process.argv
 *  - Add a --config option to process.argv if one is missing
 *  - Execute the command's bin script by pulling it directly in with require()
 *
 * This file forwards cli commands by manipulating process.argv values and then
 * directly requiring bin scripts from the specified packages (as opposed to
 * attempting to run them from the aliases npm copies to the .bin folder upon
 * install). This seems like a relatively safe thing to do since these file
 * names are identical to their cli name and this method of requiring/executing
 * them should behave the same as if run from the command line as usual.
 */

function optionExists(keys: string[]) {
  return process.argv.some((arg) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keys.length; i++) {
      if (arg.startsWith(keys[i])) {
        return true;
      }
    }
    return false;
  });
}

// Ensures that a config option already exists and if it does not adds a default
function ensureConfigOption(preset: ConfigPreset, keys = ['--config', '-c']) {
  if (!optionExists(keys)) {
    console.log(`Running with resolved config:\n\n${preset.resolvedFilepath}\n`);
    process.argv.push(keys[0]);
    process.argv.push(preset.resolvedFilepath);
  }
}

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
  case 'release':
    release();
    break;
  case 'pack':
    if (process.argv[2] === undefined) {
      console.log(chalk.red(`${chalk.bold.red(commandName)} command usage: specify a peer folder where the command should install the package:

      npm run pack my-project`));
      process.exit(1);
    }
    pack();
    break;
  case 'lint':
    ensureConfigOption(presets[ConfigPresetTypes.LINT]);
    require('.bin/eslint');
    break;
  case 'test':
    ensureConfigOption(presets[ConfigPresetTypes.TEST]);
    require('jest/bin/jest');
    break;
  case 'build':
    ensureConfigOption(presets[ConfigPresetTypes.BUILD]);
    require('webpack/bin/webpack');
    break;
  case 'build:module':
    ensureConfigOption(presets[ConfigPresetTypes.BUILD_MODULE]);
    require('webpack/bin/webpack');
    break;
  case 'dev:module':
    ensureConfigOption(presets[ConfigPresetTypes.DEV_MODULE]);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case 'dev':
    ensureConfigOption(presets[ConfigPresetTypes.DEV]);
    require('webpack-dev-server/bin/webpack-dev-server');
    break;
  case 'formatjs':
    const commonArgs = [
      '--format', 'node_modules/@openedx/frontend-base/dist/tools/cli/utils/formatter.js',
      '--ignore', 'src/**/*.json',
      '--out-file', './temp/formatjs/Default.messages.json',
      '--', 'src/**/*.js*',
    ];
    process.argv = process.argv.concat(commonArgs);
    require('@formatjs/cli/bin/formatjs');
    break;
  case 'serve':
    require('./commands/serve');
    break;
  case 'help':
    printUsage();
    break;
  default:
    console.log(`The command ${chalk.bold(commandName)} doesn't exist.`);
    console.log('');
    printUsage();
}
