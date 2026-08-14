import {
  getAuthenticatedHttpClient,
  getAuthenticatedUser,
} from '../auth';
import { getSiteConfig } from '../config';
import { updateLocale } from './lib';

/**
 * Changes the user's site language. This is the supported way to switch languages.
 *
 * - For authenticated users, persists the preference to the LMS API.
 * - For all users (authenticated and anonymous), sets the language cookie client-side
 *   and posts to the LMS setlang endpoint.
 * - Updates the UI locale immediately via updateLocale().
 *
 * @param {string} locale The locale code to switch to (e.g. 'es-419', 'ar').
 * @returns {Promise<void>} Resolves when the switch is complete. Rejects on network failure.
 * @memberof module:Internationalization
 */
export async function updateSiteLanguage(locale: string): Promise<void> {
  const user = getAuthenticatedUser();

  // Save the preference for authenticated users.
  if (user !== null) {
    await patchUserPreferences(user.username, locale);
  }

  // Post to the LMS setlang endpoint for server-side persistence.
  await postSetlang(locale);

  // Update the UI locale and RTL direction.
  updateLocale();
}

async function patchUserPreferences(username: string, locale: string) {
  const { lmsBaseUrl } = getSiteConfig();
  await getAuthenticatedHttpClient().patch(
    `${lmsBaseUrl}/api/user/v1/preferences/${username}`,
    {
      'pref-lang': locale,
    },
    {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    },
  );
}

async function postSetlang(locale: string) {
  const { lmsBaseUrl } = getSiteConfig();
  const formData = new FormData();
  formData.append('language', locale);

  // Post to the LMS setlang endpoint for server-side persistence.
  // Use the authenticated HTTP client to ensure that the request includes the CSRF token.
  // Works for both authenticated and anonymous users, since the LMS setlang endpoint is public.
  await getAuthenticatedHttpClient().patch(
    `${lmsBaseUrl}/lang_pref/update_language`,
    { 'pref-lang': locale },
    { isPublic: true },
  );
}
