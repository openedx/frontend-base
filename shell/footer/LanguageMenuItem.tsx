import { Dropdown } from '@openedx/paragon';
import { useCallback } from 'react';

import { updateSiteLanguage } from './data/api';

interface LanguageMenuItemProps {
  language: {
    code: string,
    name: string,
  },
}

export default function LanguageMenuItem({ language }: LanguageMenuItemProps) {
  const handleClick = useCallback(() => {
    updateSiteLanguage(language.code);
  }, [language.code]);

  return (
    <Dropdown.Item key={language.code} onClick={handleClick}>
      {language.name}
    </Dropdown.Item>
  );
}
