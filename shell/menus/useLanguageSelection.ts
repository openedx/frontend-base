import { useCallback, useContext, useState } from 'react';

import {
  SiteContext,
  getSupportedLanguageList,
  updateSiteLanguage,
  useIntl,
} from '../../runtime';

import messages from './messages';

/**
 * The language switching behavior shared by the language menu's presentations: the dropdown on
 * the header bar and the collapsible in the mobile menu.
 */
export default function useLanguageSelection() {
  const { formatMessage } = useIntl();
  const { locale } = useContext(SiteContext);

  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectLanguage = useCallback(async (languageCode: string) => {
    setPendingLanguage(languageCode);
    setErrorMessage(null);
    try {
      await updateSiteLanguage(languageCode);
    } catch {
      // The UI switch is optimistic and stays in the picked language; only the
      // preference save failed, so surface that without reverting.
      setErrorMessage(formatMessage(messages.languageSaveError));
    } finally {
      setPendingLanguage(null);
    }
  }, [formatMessage]);

  const dismissError = useCallback(() => setErrorMessage(null), []);

  return {
    languages: getSupportedLanguageList(),
    locale,
    // The picked language shows immediately, before the preference finishes saving.
    activeLocale: pendingLanguage ?? locale,
    pendingLanguage,
    errorMessage,
    selectLanguage,
    dismissError,
  };
}
