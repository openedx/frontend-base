import { execSync } from "child_process";
import path from "path";

export default function pack() {
  const destination = process.argv[2];
  execSync('npm run release', { stdio: 'inherit'});
  const { filename } = JSON.parse(execSync('npm pack --json').toString())[0];
  execSync(`npm --prefix ../${destination} install ${path.resolve(process.cwd(), filename)}`, { stdio: 'inherit'})
}
