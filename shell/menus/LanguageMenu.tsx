import { Dropdown, Icon, Toast } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';
import { useCallback, useContext, useState } from 'react';

import {
  SiteContext,
  getLocalizedLanguageName,
  getSupportedLanguageList,
  updateSiteLanguage,
  useIntl,
} from '../../runtime';

import LanguageMenuItem from './LanguageMenuItem';
import messages from './messages';

export default function LanguageMenu() {
  const { formatMessage } = useIntl();
  const { locale } = useContext(SiteContext);

  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const languages = getSupportedLanguageList();

  const handleSelect = useCallback(async (languageCode: string) => {
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

  // Hide the menu if there's only one language.
  if (languages.length === 1) {
    return null;
  }

  const toggleLabel = getLocalizedLanguageName(pendingLanguage ?? locale);

  return (
    <>
      <Dropdown className="mx-2">
        <Dropdown.Toggle
          id="language-menu-dropdown-trigger"
          variant="tertiary"
          className="d-flex align-items-center"
          aria-label={formatMessage(messages.languageMenuToggle, { language: toggleLabel })}
        >
          <Icon src={Language} size="sm" />
          {/* Below md the globe stands alone; the aria-label names the language at every width. */}
          <span className="d-none d-md-inline ml-2">{toggleLabel}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="overflow-auto" style={{ maxHeight: '320px' }}>
          {languages.map((language) => (
            <LanguageMenuItem
              key={language.code}
              language={language}
              disabled={pendingLanguage !== null}
              isActive={language.code === locale}
              onSelect={handleSelect}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {errorMessage && (
        <Toast
          show
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Toast>
      )}
    </>
  );
}
