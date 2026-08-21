import { Dropdown } from '@openedx/paragon';
import { useCallback } from 'react';

interface LanguageMenuItemProps {
  language: {
    code: string,
    name: string,
  },
  disabled?: boolean,
  isActive?: boolean,
  onSelect: (code: string) => void,
}

export default function LanguageMenuItem({
  language,
  disabled,
  isActive,
  onSelect,
}: LanguageMenuItemProps) {
  const handleClick = useCallback(() => {
    onSelect(language.code);
  }, [language.code, onSelect]);

  return (
    <Dropdown.Item
      key={language.code}
      className={isActive ? 'active' : ''}
      disabled={disabled}
      onClick={handleClick}
    >
      {language.name}
    </Dropdown.Item>
  );
}
