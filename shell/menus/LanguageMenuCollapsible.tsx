import { Collapsible, Icon, Menu, Toast } from '@openedx/paragon';
import classNames from 'classnames';
import { Language } from '@openedx/paragon/icons';

import { getLocalizedLanguageName } from '../../runtime';

import LanguageMenuItem from './LanguageMenuItem';
import useLanguageSelection from './useLanguageSelection';

import './languageMenu.scss';

interface LanguageMenuCollapsibleProps {
  className?: string;
}

/**
 * The language menu as an in-flow collapsible, for the mobile menu. A dropdown inside that
 * focus-trapped panel would have to escape it to be seen; this expands in place instead.
 */
export default function LanguageMenuCollapsible({ className }: LanguageMenuCollapsibleProps) {
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

  const title = (
    <span className="d-flex align-items-center">
      <Icon src={Language} size="sm" />
      <span className="ml-2">{getLocalizedLanguageName(activeLocale)}</span>
    </span>
  );

  return (
    <>
      <Collapsible
        styling="basic"
        title={title}
        className={classNames('language-menu-collapsible', className)}
        unmountOnExit
      >
        {/* Paragon scopes .pgn__menu-item under .pgn__menu, so the rows are only styled
            inside this wrapper, which also gives them arrow-key navigation. */}
        <Menu>
          {languages.map((language) => (
            <LanguageMenuItem
              key={language.code}
              language={language}
              variant="menuItem"
              disabled={pendingLanguage !== null}
              isActive={language.code === locale}
              onSelect={selectLanguage}
            />
          ))}
        </Menu>
      </Collapsible>
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
