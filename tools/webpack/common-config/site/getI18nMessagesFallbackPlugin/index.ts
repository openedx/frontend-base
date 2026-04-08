import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

// When messages.ts hasn't been generated yet (i.e. translations:pull hasn't been run),
// replace the ./messages import in src/i18n/index.ts with an empty fallback so webpack
// doesn't error on the missing file.
export default function getI18nMessagesFallbackPlugin(): webpack.NormalModuleReplacementPlugin {
  return new webpack.NormalModuleReplacementPlugin(
    // Matches the raw import string `./messages` — anchored to avoid partial matches.
    /^\.\/messages$/,
    (resource) => {
      // Only apply to imports from src/i18n/ — exact match to avoid false positives.
      if (resource.context !== path.resolve(process.cwd(), 'src', 'i18n')) return;

      // If messages.ts exists, let webpack resolve it normally.
      if (fs.existsSync(path.join(resource.context, 'messages.ts'))) return;

      // File is missing — substitute the empty fallback module.
      resource.request = require.resolve('./emptyI18n');
    },
  );
}
