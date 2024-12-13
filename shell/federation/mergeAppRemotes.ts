import { getConfig } from '../../runtime';
import { mergeRemotes } from '../../runtime/config';

export function mergeAppRemotes() {
  const { apps } = getConfig();

  for (const app of apps) {
    if (app.remotes !== undefined) {
      mergeRemotes(app.remotes);
    }
  }
}
