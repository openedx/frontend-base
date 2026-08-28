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
 * Both requests are attempted regardless of whether the other one fails, so a failed
 * preference save doesn't prevent the session cookie from being set, and vice versa.
 *
 * @param {string} locale The locale code to switch to (e.g. 'es-419', 'ar').
 * @returns {Promise<void>} Resolves when the switch is complete. Rejects with an
 *                          AggregateError of the failures if any request fails.
 * @memberof module:Internationalization
 */
export async function updateSiteLanguage(locale: string): Promise<void> {
  const user = getAuthenticatedUser();

  // Update the UI locale and RTL direction immediately, before waiting on any
  // network requests. This ensures that the UI reflects the change without delay.
  updateLocale(locale);

  const requests = [setSessionLanguage(locale)];

  // Save the preference for authenticated users.
  if (user !== null) {
    requests.push(patchUserPreferences(user.username, locale));
  }

  const results = await Promise.allSettled(requests);
  const failures = results
    .filter((result) => result.status === 'rejected')
    .map((result) => (result as PromiseRejectedResult).reason);

  if (failures.length > 0) {
    throw new AggregateError(failures, `Failed to persist the site language '${locale}'.`);
  }
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

  // Use the authenticated HTTP client to ensure that the request includes the CSRF token.
  // Works for both authenticated and anonymous users, since the endpoint is public.
  await getAuthenticatedHttpClient().patch(
    `${lmsBaseUrl}/lang_pref/update_language`,
    { 'pref-lang': locale },
    { isPublic: true },
  );
}
