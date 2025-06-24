import { useAuthenticatedUser } from '../../runtime';
import { getUrlByRouteRole } from '../../runtime/routing';
import { MenuItemName } from '../../types';

import LinkMenuItem from './LinkMenuItem';

interface ProfileLinkMenuItemProps {
  label: MenuItemName,
  role: string,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function ProfileLinkMenuItem({ label, role, variant = 'hyperlink' }: ProfileLinkMenuItemProps) {
  const authenticatedUser = useAuthenticatedUser();
  let baseUrl = getUrlByRouteRole(role);

  if (!baseUrl)
    return null;

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const url = `${baseUrl}/u/${authenticatedUser?.username}`;

  return (
    <LinkMenuItem
      label={label}
      url={url}
      variant={variant}
    />
  );
}
