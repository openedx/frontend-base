import { AvatarButton, Dropdown } from '@openedx/paragon';

import {
  Slot,
  useAuthenticatedUser
} from '../../runtime';

interface AuthenticatedMenuProps {
  className?: string,
}

export default function AuthenticatedMenu({ className }: AuthenticatedMenuProps) {
  const authenticatedUser = useAuthenticatedUser();

  const displayUserName = authenticatedUser?.name || authenticatedUser?.username;

  return (
    <Dropdown className={className}>
      <Dropdown.Toggle
        as={AvatarButton}
        id="user-nav-dropdown"
        variant="outline-primary"
        src={authenticatedUser?.avatar}
      >
        {displayUserName}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Slot id="org.openedx.frontend.slot.header.authenticatedMenu.v1" />
      </Dropdown.Menu>
    </Dropdown>
  );
}
