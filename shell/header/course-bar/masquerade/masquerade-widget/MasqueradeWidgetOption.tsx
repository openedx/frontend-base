import { Dropdown } from '@openedx/paragon';

import { useMasqueradeContext } from '../MasqueradeContext';
import { isOptionSelected } from '../hooks';
import type { MasqueradeOption } from '../data/api';

interface Props {
  option: MasqueradeOption,
}

export function MasqueradeWidgetOption({ option }: Props) {
  const { active, pendingOption, select } = useMasqueradeContext();

  if (!option.name) {
    return null;
  }

  /* While a click is pending, the menu mirrors the toggle: only that option
   * is highlighted.  Once the server confirms (pendingOption clears), the
   * active-server-state logic takes over again. */
  const isHighlighted = pendingOption !== null
    ? option.name === pendingOption.name
    : isOptionSelected(option, active);

  return (
    <Dropdown.Item
      className={isHighlighted ? 'active' : ''}
      href="#"
      onClick={() => select(option)}
    >
      {option.name}
    </Dropdown.Item>
  );
}
