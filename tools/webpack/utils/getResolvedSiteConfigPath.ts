import fs from 'fs';
import path from 'path';

export default function getResolvedSiteConfigPath(defaultFilename: string) {
  let siteConfigPath = process.env.SITE_CONFIG_PATH;

  if (siteConfigPath !== undefined) {
    // We assume siteConfigPath is a relative path.
    const absolutePath = path.resolve(process.cwd(), siteConfigPath);
    if (fs.existsSync(absolutePath)) {
      // If it's a valid absolute path when joined with the current working directory, return that.
      return absolutePath;
    }
  }
  // Otherwise, return our default site config file path.
  const defaultPath = path.resolve(process.cwd(), defaultFilename);
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  // They supplied something but we can't figure out what it is.  Exit with an error.
  if (siteConfigPath !== undefined) {
    console.error(`Invalid site config path (${siteConfigPath} specified as an environment variable. Aborting.`);
  } else {
    console.error(`Default site config file (${defaultPath}) does not exist. Aborting.`)
  }
  process.exit(1);
}
