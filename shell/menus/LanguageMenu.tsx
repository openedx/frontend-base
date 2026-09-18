import { Dropdown, Icon, Toast } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';
import classNames from 'classnames';

import { getLocalizedLanguageName, useIntl } from '../../runtime';

import LanguageMenuItem from './LanguageMenuItem';
import messages from './messages';
import useLanguageSelection from './useLanguageSelection';

interface LanguageMenuProps {
  className?: string;
}

export default function LanguageMenu({ className }: LanguageMenuProps) {
  const { formatMessage } = useIntl();
  const {
    languages,
    locale,
    activeLocale,
    pendingLanguage,
    errorMessage,
    selectLanguage,
    dismissError,
  } = useLanguageSelection();

  // Hide the menu if there's only one language.
  if (languages.length === 1) {
    return null;
  }

  const toggleLabel = getLocalizedLanguageName(activeLocale);

  return (
    <>
      <Dropdown className={classNames('mx-2', className)}>
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
              onSelect={selectLanguage}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {errorMessage && (
        <Toast
          show
          onClose={dismissError}
        >
          {errorMessage}
        </Toast>
      )}
    </>
  );
}
