import React from 'react';
import { useIntl } from 'react-intl';
import { getAuthenticatedUser } from '../../../../runtime';
import { LinkMenuItem } from '../../types';
import Avatar from '../Avatar';
import messages from '../DefaultHeader.messages';
import { CaretIcon } from '../Icons';
import { Menu, MenuContent, MenuTrigger } from '../menu';

interface DesktopUserMenuProps {
  userMenu: Array<{
    heading: string,
    items: Array<LinkMenuItem>,
  }>,
  avatar?: string,
}

export default function DesktopUserMenu({ userMenu, avatar }: DesktopUserMenuProps) {
  const intl = useIntl();
  const { username } = getAuthenticatedUser();
  return (
    <Menu transitionClassName="menu-dropdown" transitionTimeout={250}>
      <MenuTrigger
        tag="button"
        aria-label={intl.formatMessage(messages['header.label.account.menu.for'], { username })}
        className="btn btn-outline-primary d-inline-flex align-items-center pl-2 pr-3"
      >
        <Avatar size="1.5em" src={avatar} alt="" className="mr-2" />
        {username} <CaretIcon role="img" aria-hidden focusable="false" />
      </MenuTrigger>
      <MenuContent className="mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2">
        {userMenu.map((group, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            {group.heading && (
              <div className="dropdown-header" role="heading" aria-level={1}>{group.heading}</div>
            )}
            {group.items.map(({
              type, content, href, disabled, isActive, onClick,
            }) => (
              <a
                className={`dropdown-${type}${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
                key={`${type}-${content}`}
                href={href}
                onClick={onClick}
              >
                {content}
              </a>
            ))}
            {index < userMenu.length - 1 && <div className="dropdown-divider" role="separator" />}
          </React.Fragment>
        ))}
      </MenuContent>
    </Menu>
  );
}
