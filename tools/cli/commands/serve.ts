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

if (isDirectoryEmpty(buildPath)) {
  const formattedBuildCmd = chalk.bold.redBright('``npm run build``');
  console.log(chalk.bold.red(`ERROR: No build found. Please run ${formattedBuildCmd} first.`));
} else {
  const app = express();

  app.use(compression());
  app.use(express.static(buildPath));
  app.use('*', (req, res) => {
    res.sendFile(buildPathIndex);
  });

  // Fallback to standard example port if no PORT config is set.
  const PORT = process.env.PORT ?? 8080;

  app.listen(PORT, () => {
    const formattedServedFile = chalk.bold.cyanBright(buildPathIndex);
    const formattedPort = chalk.bold.cyanBright(PORT);
    console.log(chalk.greenBright(`Serving ${formattedServedFile} on port ${formattedPort}...`));
  });
}
