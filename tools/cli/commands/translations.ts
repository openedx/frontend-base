import child_process from 'child_process';
import { prepare, pull } from '../utils/translations';

export function runPrepare(): void {
  prepare({ siteRoot: process.cwd() });
}

export function runPull(): void {
  pull({
    siteRoot: process.cwd(),
    execFileSync: (file, args) => child_process.execFileSync(file, args, { stdio: 'inherit' }),
    shouldPrepare: !process.argv.includes('--no-prepare'),
    atlasOptions: process.argv.find(a => a.startsWith('--atlas-options='))?.slice('--atlas-options='.length),
  });
}
