import { Dropdown, MenuItem } from '@openedx/paragon';
import { useCallback } from 'react';

interface LanguageMenuItemProps {
  language: {
    code: string;
    name: string;
  };
  disabled?: boolean;
  isActive?: boolean;
  variant?: 'dropdownItem' | 'menuItem';
  onSelect: (code: string) => void;
}

export default function LanguageMenuItem({
  language,
  disabled,
  isActive,
  variant = 'dropdownItem',
  onSelect,
}: LanguageMenuItemProps) {
  const handleClick = useCallback(() => {
    onSelect(language.code);
  }, [language.code, onSelect]);

  if (variant === 'menuItem') {
    return (
      <MenuItem
        type="button"
        // .pgn__menu-item is sized for a floating menu; these rows fill their panel instead.
        className="w-100"
        disabled={disabled}
        aria-current={isActive ? 'true' : undefined}
        onClick={handleClick}
      >
        {language.name}
      </MenuItem>
    );
  }

  return (
    <Dropdown.Item
      active={isActive}
      disabled={disabled}
      onClick={handleClick}
    >
      {language.name}
    </Dropdown.Item>
  );
}
