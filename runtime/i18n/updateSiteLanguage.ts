import {
  getAuthenticatedHttpClient,
  getAuthenticatedUser,
  getHttpClient,
} from '../auth';
import { getSiteConfig } from '../config';
import { getCookies, updateLocale } from './lib';

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

  // Set the cookie client-side so the UI can read it immediately,
  // without depending on the server's Set-Cookie header.
  const { languagePreferenceCookieName } = getSiteConfig();
  if (languagePreferenceCookieName) {
    getCookies().set(languagePreferenceCookieName, locale, { path: '/' });
  }

  // Also post to the LMS setlang endpoint for server-side persistence.
  // Use the unauthenticated client so this works for anonymous users too.
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

  await getAuthenticatedHttpClient().patch(
    `${lmsBaseUrl}/lang_pref/update_language`,
    { 'pref-lang': locale },
    { isPublic: true },
  );
}
