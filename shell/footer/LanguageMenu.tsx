import { Dropdown } from '@openedx/paragon';
import { useContext } from 'react';

import {
  AppContext,
  getLocalizedLanguageName,
  getSupportedLanguageList
} from '../../runtime';

import LanguageMenuItem from './LanguageMenuItem';

export default function LanguageMenu() {
  const { locale } = useContext(AppContext);

  const languages = getSupportedLanguageList();
  const currentLanguageName = getLocalizedLanguageName(locale);

  // Hide the menu if there's only one language.
  if (languages.length === 1) {
    return null;
  }

  return (
    <Dropdown>
      <Dropdown.Toggle id="language-menu-dropdown-trigger" variant="outline-primary" size="sm">
        {currentLanguageName}
      </Dropdown.Toggle>
      <Dropdown.Menu className="overflow-auto" style={{ maxHeight: '320px' }}>
        {languages.map((language) => (
          <LanguageMenuItem key={language.code} language={language} />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
