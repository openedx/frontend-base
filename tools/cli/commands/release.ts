import chalk from "chalk";
import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import path from "path";

export default function release() {

  const tsconfigPath = path.resolve(process.cwd(), './tsconfig.build.json');
  if (!existsSync(tsconfigPath)) {
    console.error(chalk.red('openedx release: the library must include a tsconfig.build.json. Aborting.'))
    process.exit(1);
  }

  // Clean up our dist folder.
  rmSync(path.resolve(process.cwd(), 'dist'), { recursive: true, force: true });

  execSync(`tsc --project ${path.resolve(process.cwd(), './tsconfig.build.json')}`, { stdio: 'inherit'});

  // Copy all non JS/TS files from src into dist.  This is so imports of our assets still work.
  execSync(`rsync -aR src/**/* --exclude='*.tsx' --exclude='*.ts' --exclude='*.js' --exclude='*.jsx' dist/`);

  // The above rsync command will put the files in dist/src - move them up a folder into dist,
  // merging them into the compiled code there, and then delete dist/src.
  if (existsSync(path.resolve(process.cwd(), 'dist/src'))) {
    execSync('cp -R dist/src/* dist');
    execSync('rm -rf dist/src');
  }
}
