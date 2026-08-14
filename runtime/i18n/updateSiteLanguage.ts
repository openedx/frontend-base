import {
  getAuthenticatedHttpClient,
  getAuthenticatedUser,
} from '../auth';
import { getSiteConfig } from '../config';
import { updateLocale } from './lib';

/**
 * Changes the user's site language. This is the supported way to switch languages.
 *
 * - Updates the UI locale immediately via updateLocale(), so the change is reflected
 *   without waiting for the network requests to complete.
 * - For authenticated users, persists the preference to the LMS API.
 * - For all users (authenticated and anonymous), sets the language cookie via the LMS language preference endpoint.
 *
 * @param {string} locale The locale code to switch to (e.g. 'es-419', 'ar').
 * @returns {Promise<void>} Resolves when the switch is complete. Rejects on network failure.
 * @memberof module:Internationalization
 */
export async function updateSiteLanguage(locale: string): Promise<void> {
  const user = getAuthenticatedUser();

  // Update the UI locale and RTL direction immediately, before waiting on any
  // network requests. This ensures that the UI reflects the change without delay.
  updateLocale(locale);

  // Save the preference for authenticated users.
  if (user !== null) {
    await patchUserPreferences(user.username, locale);
  }

  await setSessionLanguage(locale);
}

/**
 * Updates user language preferences via the preferences API.
 *
 * @param {string} username - The username of the authenticated user.
 * @param {string} locale - The selected language locale code (e.g., 'en', 'es-419', 'ar', 'de-de').
 *                          Should be a valid ISO language code supported by the platform. For reference:
 *                          https://github.com/openedx/openedx-platform/blob/master/openedx/envs/common.py#L231
 * @returns {Promise} - A promise that resolves when the API call completes successfully,
 *                      or rejects if there's an error with the request. Returns early if no user is authenticated.
 */
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

/**
 * Sets the language for the current session using the lang preference endpoint.
 *
 * This function sends a PATCH request to the LMS update_language endpoint to change
 * the language for the current user session.
 *
 * @param {string} locale - The selected language locale code (e.g., 'en', 'es-419', 'ar', 'de-de').
 *                          Should be a valid ISO language code supported by the platform. For reference:
 *                          https://github.com/openedx/openedx-platform/blob/master/openedx/envs/common.py#L231
 * @returns {Promise} - A promise that resolves when the API call completes successfully,
 *                      or rejects if there's an error with the request.
 */
async function setSessionLanguage(locale: string) {
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
