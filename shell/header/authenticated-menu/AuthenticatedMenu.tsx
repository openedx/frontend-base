import { DropdownButton } from '@openedx/paragon';
import { Person } from '@openedx/paragon/icons';

import { useContext } from 'react';
import {
  useAuthenticatedUser
} from '../../../runtime';

import HeaderContext from '../HeaderContext';
import DropdownItem from '../nav-links/DropdownItem';

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
      {authenticatedLinks.map((item, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <DropdownItem key={index} item={item} />
      ))}
    </DropdownButton>
  );
}
