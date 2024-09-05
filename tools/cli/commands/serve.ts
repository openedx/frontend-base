import chalk from 'chalk';
import compression from 'compression';
import express from 'express';
import fs from 'fs';
import path from 'path';

function isDirectoryEmpty(directoryPath: string) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.length === 0;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Directory does not exist, so treat it as empty.
      return true;
    }
    throw error; // Throw the error for other cases
  }
}

const buildPath = path.join(process.cwd(), 'dist');
const buildPathIndex = path.join(buildPath, 'index.html');

const fallbackPort = 8080;

if (isDirectoryEmpty(buildPath)) {
  const formattedBuildCmd = chalk.bold.redBright('``npm run build``');
  console.log(chalk.bold.red(`ERROR: No build found. Please run ${formattedBuildCmd} first.`));
} else {
  let configuredPort;

  try {
    configuredPort = require(path.join(process.cwd(), 'site.config.tsx'))?.PORT;
  } catch (error) {
    // Pass. Consuming applications may not have an `site.config.tsx` file. This is OK.
  }

  if (!configuredPort) {
    configuredPort = process.env.PORT;
  }

  // No `PORT` found in `site.config.tsx` and/or `.env.development|private`, so output a warning.
  if (!configuredPort) {
    const formattedEnvDev = chalk.bold.yellowBright('.env.development');
    const formattedEnvConfig = chalk.bold.yellowBright('site.config.tsx');
    const formattedPort = chalk.bold.yellowBright(fallbackPort);
    console.log(chalk.yellow(`No port found in ${formattedEnvDev} and/or ${formattedEnvConfig} file(s). Falling back to port ${formattedPort}.\n`));
  }

  const app = express();

  // Fallback to standard example port if no PORT config is set.
  const PORT = configuredPort || fallbackPort;

  app.use(compression());
  app.use(express.static(buildPath));

  app.use('*', (req, res) => {
    res.sendFile(buildPathIndex);
  });

  app.listen(PORT, () => {
    const formattedServedFile = chalk.bold.cyanBright(buildPathIndex);
    const formattedPort = chalk.bold.cyanBright(PORT);
    console.log(chalk.greenBright(`Serving ${formattedServedFile} on port ${formattedPort}...`));
  });
}
