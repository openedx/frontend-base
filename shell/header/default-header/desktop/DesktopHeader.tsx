import { useIntl } from '../../../../runtime';

// Local Components
import LinkedLogo from '../../LinkedLogo';
import Logo from '../../Logo';

// i18n
import messages from '../DefaultHeader.messages';

// Assets
import { LinkMenuItem } from '../../types';
import DesktopLinkMenu from './DesktopLinkMenu';
import DesktopLoggedOutLinkMenu from './DesktopLoggedOutLinkMenu';
import DesktopUserMenu from './DesktopUserMenu';

interface DesktopHeaderProps {
  mainMenu: Array<LinkMenuItem>,
  secondaryMenu: Array<LinkMenuItem>,
  userMenu: Array<{
    heading: string,
    items: Array<LinkMenuItem>,
  }>,
  loggedOutItems: Array<LinkMenuItem>,
  logo: string,
  logoAltText: string,
  logoDestination: string,
  avatar?: string,
  loggedIn: boolean,
}

export default function DesktopHeader({
  mainMenu = [],
  secondaryMenu = [],
  userMenu = [],
  loggedOutItems = [],
  logo,
  logoAltText,
  logoDestination,
  avatar,
  loggedIn = false,
}: DesktopHeaderProps) {
  const intl = useIntl();

  return (
    <header className="site-header-desktop">
      <a className="nav-skip sr-only sr-only-focusable" href="#main">{intl.formatMessage(messages['header.label.skip.nav'])}</a>
      <div className="container-fluid">
        <div className="nav-container position-relative d-flex align-items-center">
          {logoDestination === null ? (
            <Logo className="logo" src={logo} alt={logoAltText} />
          ) : (
            <LinkedLogo className="logo" src={logo} alt={logoAltText} href={logoDestination} />
          )}
          <nav
            aria-label={intl.formatMessage(messages['header.label.main.nav'])}
            className="nav main-nav"
          >
            <DesktopLinkMenu menu={mainMenu} />
          </nav>
          <nav
            aria-label={intl.formatMessage(messages['header.label.secondary.nav'])}
            className="nav secondary-menu-container align-items-center ml-auto"
          >
            {loggedIn ? (
              <>
                <DesktopLinkMenu menu={secondaryMenu} />
                <DesktopUserMenu
                  userMenu={userMenu}
                  avatar={avatar}
                />
              </>
            ) : (
              <DesktopLoggedOutLinkMenu loggedOutItems={loggedOutItems} />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
