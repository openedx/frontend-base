import { DropdownButton } from '@openedx/paragon';
import { Person } from '@openedx/paragon/icons';

import {
  useAuthenticatedUser
} from '../../runtime';

import Slot from '../../runtime/slots/Slot';

interface AuthenticatedMenuProps {
  className?: string,
}

export default function AuthenticatedMenu({ className }: AuthenticatedMenuProps) {
  const authenticatedUser = useAuthenticatedUser();

  const title = (
    <div className="d-flex mr-2 align-items-center gap-2">
      <Person />
      {authenticatedUser !== null ? authenticatedUser.name : null}
    </div>
  );

  return (
    <DropdownButton size="sm" id="user-nav-dropdown" title={title} variant="outline-primary" className={className}>
      <Slot id="frontend.shell.header.authenticatedMenu.widget" />
    </DropdownButton>
  );
}
