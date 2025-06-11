import { DropdownButton } from '@openedx/paragon';
import { Person } from '@openedx/paragon/icons';

import {
  Slot,
  useAuthenticatedUser
} from '../../runtime';

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
      <Slot id="org.openedx.frontend.slot.header.authenticatedMenu.v1" />
    </DropdownButton>
  );
}
