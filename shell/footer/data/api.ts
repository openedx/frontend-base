import {
  getAuthenticatedHttpClient,
  getAuthenticatedUser,
  getSiteConfig,
  updateLocale
} from '../../../runtime';

export async function updateSiteLanguage(locale: string) {
  const user = getAuthenticatedUser();

  if (user !== null) {
    const { username } = getAuthenticatedUser();
    await patchUserPreferences(username, locale);
  }
  await postSetlang(locale);

  updateLocale();
}

async function patchUserPreferences(username: string, locale: string) {
  await getAuthenticatedHttpClient().patch(
    `${getSiteConfig().lmsBaseUrl}/api/user/v1/preferences/${username}`,
    {
      'pref-lang': locale
    },
    {
      headers: {
        'Content-Type': 'application/merge-patch+json'
      },
    }
  );
}

async function postSetlang(locale: string) {
  const formData = new FormData();
  formData.append('language', locale);

  await getAuthenticatedHttpClient().post(
    `${getSiteConfig().lmsBaseUrl}/i18n/setlang/`,
    formData,
    {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  );
}
