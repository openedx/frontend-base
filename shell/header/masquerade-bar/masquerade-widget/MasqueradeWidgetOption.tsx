import React from 'react';
import { Dropdown } from '@openedx/paragon';
import { useMasqueradeContext } from './MasqueradeContext';
import type { MasqueradeOption } from './data/api';

interface Props {
  option: MasqueradeOption,
}

export const MasqueradeWidgetOption: React.FC<Props> = ({ option }) => {
  const { select, selectedOptionName } = useMasqueradeContext();

  const handleClick = React.useCallback(() => {
    select(option);
  }, [select, option]);

  if (!option.name) {
    return null;
  }

  return (
    <Dropdown.Item
      active={option.name === selectedOptionName}
      href="#"
      onClick={handleClick}
    >
      {option.name}
    </Dropdown.Item>
  );
};
