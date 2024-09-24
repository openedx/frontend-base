import {
  Avatar,
} from '@openedx/paragon';
import { useIntl } from '../../../runtime';
import NavDropdownMenu from './NavDropdownMenu';
import getUserMenuItems from './utils';

interface UserMenuProps {
  username: string,
  studioBaseUrl: string,
  logoutUrl: string,
  authenticatedUserAvatar: string,
  isMobile?: boolean,
  isAdmin?: boolean,
}

export default function UserMenu({
  username,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isMobile = false,
  isAdmin = false,
}: UserMenuProps) {
  const intl = useIntl();
  const avatar = authenticatedUserAvatar ? (
    <img
      className="d-block w-100 h-100"
      src={authenticatedUserAvatar}
      alt={username}
      data-testid="avatar-image"
    />
  ) : (
    <Avatar
      size="sm"
      className="mr-2"
      alt={username}
      data-testid="avatar-icon"
    />
  );
  const title = isMobile ? avatar : <>{avatar}{username}</>;

  return (
    <NavDropdownMenu
      buttonTitle={title}
      id="user-dropdown-menu"
      items={getUserMenuItems({
        studioBaseUrl,
        logoutUrl,
        intl,
        isAdmin,
      })}
    />
  );
}
