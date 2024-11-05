import { DropdownButton } from '@openedx/paragon';
import { Person } from '@openedx/paragon/icons';

import { useContext } from 'react';
import {
  useAuthenticatedUser
} from '../../../runtime';

import ChildMenuItem from '../../menus/ChildMenuItem';
import HeaderContext from '../HeaderContext';

interface AuthenticatedMenuProps {
  className?: string,
}

export default function AuthenticatedMenu({ className }: AuthenticatedMenuProps) {
  const authenticatedUser = useAuthenticatedUser();

  const { authenticatedLinks } = useContext(HeaderContext);

  const title = (
    <div className="d-flex mr-2 align-items-center gap-2">
      <Person />
      {authenticatedUser !== null ? authenticatedUser.name : null}
    </div>
  );

  return (
    <DropdownButton size="sm" id="user-nav-dropdown" title={title} variant="outline-primary" className={className}>
      {authenticatedLinks.map((item) => (
        <ChildMenuItem key={item.id} item={item} variant="dropdownItem" />
      ))}
    </DropdownButton>
  );
}
