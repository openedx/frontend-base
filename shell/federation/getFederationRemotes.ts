import { getConfig, isValidVariableName } from '../../runtime';

export function getFederationRemotes() {
  const { remotes } = getConfig();
  if (Array.isArray(remotes)) {
    // Validate the remote IDs are valid names.
    remotes.forEach(remote => {
      if (!isValidVariableName(remote.id)) {
        throw new Error(`Module federation error.\n\nThe remote ID "${remote.id}" is invalid. This remote's URL is "${remote.url}".\n\nThe identifier must be a valid JavaScript variable name.  It must start with a letter, cannot be a reserved word, and can only contain letters, digits, underscores and dollar signs.`);
      }
    });

    return remotes.map((remote) => ({
      name: remote.id,
      // We add a date here to ensure that we cache bust the remote entry file regardless of what
      // headers it returns to us.  This ensures that even if operators haven't set up their
      // caching headers correctly, we always get the most recent version.
      entry: `${remote.url}?${new Date().getTime()}`,
    }));
  }
  return [];
}
