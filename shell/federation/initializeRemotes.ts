import { init } from '@module-federation/runtime';
import { SHELL_ID } from './constants';
import { getFederationRemotes } from './getFederationRemotes';
import { mergeAppRemotes } from './mergeAppRemotes';

export function initializeRemotes() {
  mergeAppRemotes();
  // The `init` function is re-entrant, so we just give it the whole list again.
  init({
    name: SHELL_ID,
    remotes: getFederationRemotes(),
  });
}
