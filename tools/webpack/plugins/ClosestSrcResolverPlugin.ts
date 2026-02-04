import fs from 'fs';
import path from 'path';
import { Resolver } from 'webpack';

/**
 * A webpack resolver plugin that resolves `@src` imports to the closest
 * `src` directory by walking up from the importing file's location.
 *
 * This allows apps to have their own `src` directories, with `@src` always
 * resolving to the nearest one relative to the file doing the import.
 */
class ClosestSrcResolverPlugin {
  apply(resolver: Resolver) {
    const target = resolver.ensureHook('resolve');

    resolver.getHook('resolve').tapAsync(
      'ClosestSrcResolverPlugin',
      (request: any, resolveContext: any, callback: (err?: null | Error, result?: any) => void) => {
        if (!request.request?.startsWith('@src')) {
          return callback();
        }

        // Get the directory of the file doing the import
        const issuer = request.context?.issuer;
        if (!issuer) {
          return callback();
        }

        // Walk up from the issuer to find closest 'src' directory,
        // but don't go above the current working directory
        const cwd = process.cwd();
        let dir = path.dirname(issuer);
        let srcPath: string | null = null;

        while (dir.startsWith(cwd) && dir !== path.parse(dir).root) {
          const candidate = path.join(dir, 'src');
          if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
            srcPath = candidate;
            break;
          }
          dir = path.dirname(dir);
        }

        if (!srcPath) {
          return callback();
        }

        // Replace @src with the actual path
        const newRequest = request.request.replace(/^@src/, srcPath);

        const obj = {
          ...request,
          request: newRequest,
        };

        resolver.doResolve(target, obj, null, resolveContext, callback);
      }
    );
  }
}

export default ClosestSrcResolverPlugin;
