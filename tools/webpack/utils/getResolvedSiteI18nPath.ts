import fs from 'fs';
import path from 'path';

export default function getResolvedSiteI18nPath(defaultDirname: string) {
  const siteI18nPath = process.env.SITE_I18N_PATH;

  if (siteI18nPath !== undefined) {
    const absolutePath = path.resolve(process.cwd(), siteI18nPath);
    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
    console.error(`Invalid site i18n path (${siteI18nPath}) specified as an environment variable. Aborting.`);
    process.exit(1);
  }

  const defaultPath = path.resolve(process.cwd(), defaultDirname);
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  console.error(`Default site i18n directory (${defaultPath}) does not exist. Aborting.`);
  process.exit(1);
}
