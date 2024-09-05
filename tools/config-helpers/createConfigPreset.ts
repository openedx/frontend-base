export default function createConfigPreset({
  defaultDir,
  defaultFilename,
  searchFilenames,
  searchFilepaths,
}: {
  defaultDir: string, defaultFilename: string, searchFilenames: string[], searchFilepaths: string[]
}) {
  return {
    defaultFilename,
    getDefault: () => require(require.resolve(`./${defaultFilename}`, { paths: [defaultDir] })),
    get defaultFilepath() {
      console.log('getting default filepath', defaultFilename, defaultDir);
      return require.resolve(`./${defaultFilename}`, { paths: [defaultDir] });
    },
    get resolvedFilepath() {
      return resolveFilepaths(
        searchFilenames.map((filename: string) => `./${filename}`),
        [...searchFilepaths, defaultDir]
      );
    }
  };
}

// Resolves a filepath given an array of filepaths and an array of resolvePaths
// (directories to check). Useful for finding files and resolving to defaults
// if they don't exist.
function resolveFilepaths(filepaths: string[], resolvePaths = [process.cwd()]) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < filepaths.length; i++) {
    try {
      return require.resolve(filepaths[i], { paths: resolvePaths });
    } catch (e) {
      // Do nothing, maybe we'll find it in the next loop
    }
  }
  throw new Error(`Could not resolve files:\n ${filepaths.join('\n')}\n\n in directories:\n ${resolvePaths.join(', ')}\n`);
};
