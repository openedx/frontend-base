import { MenuIcon } from '@openedx/paragon/icons';
import classNames from 'classnames';

import { getAuthenticatedUser, useIntl } from '../../../../runtime';
import LinkedLogo from '../../LinkedLogo';
import Logo from '../../Logo';
import { LinkMenuItem } from '../../types';
import Avatar from '../Avatar';
import messages from '../DefaultHeader.messages';
import { Menu, MenuContent, MenuTrigger } from '../menu';
import LinkMenu from './LinkMenu';
import LoggedOutMenu from './LoggedOutLinkMenu';
import UserMenu from './UserMenu';

interface MobileHeaderProps {
  mainMenu: Array<LinkMenuItem>,
  secondaryMenu: Array<LinkMenuItem>,
  userMenu: Array<{
    heading: string,
    items: Array<LinkMenuItem>,
  }>,
  loggedOutItems: Array<{
    href: string,
    content: string,
  }>,
  logo: string,
  logoAltText: string,
  logoDestination?: string,
  avatar?: string,
  loggedIn: boolean,
  stickyOnMobile?: boolean,
}

export default function MobileHeader({
  logo,
  logoAltText,
  logoDestination,
  loggedIn = false,
  avatar,
  stickyOnMobile = true,
  mainMenu = [],
  secondaryMenu = [],
  userMenu = [],
  loggedOutItems = []
}: MobileHeaderProps) {
  const intl = useIntl();
  let username = null;
  if (getAuthenticatedUser() !== null) {
    username = getAuthenticatedUser().username;
  }
  return (
    <header
      aria-label={intl.formatMessage(messages['header.label.main.header'])}
      className={classNames(
        'site-header-mobile d-flex justify-content-between align-items-center shadow',
        { 'sticky-top': stickyOnMobile }
      )}
    >
      <a className="nav-skip sr-only sr-only-focusable" href="#main">{intl.formatMessage(messages['header.label.skip.nav'])}</a>
      {mainMenu.length > 0 ? (
        <div className="w-100 d-flex justify-content-start">

          <Menu className="position-static">
            <MenuTrigger
              tag="button"
              className="icon-button"
              aria-label={intl.formatMessage(messages['header.label.main.menu'])}
              title={intl.formatMessage(messages['header.label.main.menu'])}
            >
              <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
            </MenuTrigger>
            <MenuContent
              tag="nav"
              aria-label={intl.formatMessage(messages['header.label.main.nav'])}
              className="nav flex-column pin-left pin-right border-top shadow py-2"
            >
              {Array.isArray(mainMenu) ? (
                { mainMenu }
              ) : (
                <LinkMenu menu={mainMenu} />
              )}
              {Array.isArray(secondaryMenu) ? (
                { secondaryMenu }
              ) : (
                <LinkMenu menu={secondaryMenu} />
              )}
            </MenuContent>
          </Menu>
        </div>
      ) : null}
      <div className="w-100 d-flex justify-content-center">
        {logoDestination === undefined ? (
          <Logo className="logo" src={logo} alt={logoAltText} />
        ) : (
          <LinkedLogo className="logo" src={logo} alt={logoAltText} href={logoDestination} itemType="http://schema.org/Organization" />
        )}
      </div>
      {userMenu.length > 0 || loggedOutItems.length > 0 ? (
        <div className="w-100 d-flex justify-content-end align-items-center">
          <Menu tag="nav" aria-label={intl.formatMessage(messages['header.label.secondary.nav'])} className="position-static">
            <MenuTrigger
              tag="button"
              className="icon-button"
              aria-label={intl.formatMessage(messages['header.label.account.menu'])}
              title={intl.formatMessage(messages['header.label.account.menu'])}
            >
              <Avatar size="1.5rem" src={avatar} alt={username || intl.formatMessage(messages['header.label.user.avatar'])} />
            </MenuTrigger>
            <MenuContent tag="ul" className="nav flex-column pin-left pin-right border-top shadow py-2">
              {loggedIn ? (
                <UserMenu userMenuItems={userMenu} />
              ) : (
                <LoggedOutMenu loggedOutItems={loggedOutItems} />
              )}
            </MenuContent>
          </Menu>
        </div>
      ) : null}
    </header>
  );
}
