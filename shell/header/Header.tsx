import {
  Button,
  Truncate,
  useMediaQuery
} from '@openedx/paragon';
import { MenuIcon } from '@openedx/paragon/icons';
import classNames from 'classnames';
import {
  useCallback,
  useState
} from 'react';
import { FocusOn } from 'react-focus-on';

import { useAuthenticatedUser, useConfig, useIntl } from '../../runtime';

import Divider from '../../runtime/react/Divider';
import { MenuItem } from '../../types';
import AnonymousMenu from './AnonymousMenu';
import AuthenticatedMenu from './AuthenticatedMenu';
import messages from './Header.messages';
import Logo from './Logo';
import NavLinks from './NavLinks';

export default function Header() {
  const authenticatedUser = useAuthenticatedUser();
  const intl = useIntl();

  const config = useConfig();
  let primaryLinks: Array<MenuItem> = [];
  let secondaryLinks: Array<MenuItem> = [];
  if (config.header !== undefined) {
    if (config.header.primaryLinks !== undefined) {
      primaryLinks = config.header.primaryLinks;
    }
    if (config.header.secondaryLinks !== undefined) {
      secondaryLinks = config.header.secondaryLinks;
    }
  }

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const course = {
    title: 'My Course Has A Pretty Long Title',
    number: '101',
    org: 'DavidX',
  };

  const handleMobileButtonClick = useCallback(() => {
    setMobileOpen((value) => !value);
  }, []);

  const userMenu = authenticatedUser ? (
    <AuthenticatedMenu />
  ) : (
    <AnonymousMenu />
  );

  const allLinks = [
    ...primaryLinks,
  ];

  if (primaryLinks.length > 0 && secondaryLinks.length > 0) {
    allLinks.push(<Divider />);
  }

  allLinks.push(...secondaryLinks);

  return (
    <nav className="py-2 px-3 border-bottom">
      <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
      <div
        className={classNames(
          'align-items-center justify-content-between',
          isMobile ? 'd-none' : 'd-flex'
        )}
      >
        <div className="d-flex flex-grow-1 align-items-center">
          <Logo />
          {course && (
            <div className="d-flex flex-column flex-shrink-1 mx-3">
              <Truncate className="font-weight-bold small">{course.title}</Truncate>
              <Truncate className="x-small">{`${course.org} ${course.number}`}</Truncate>
            </div>
          )}
          <NavLinks items={primaryLinks} className="flex-nowrap" />
        </div>
        <div className="d-flex align-items-center">
          <NavLinks items={secondaryLinks} className="flex-nowrap" />
          {userMenu}
        </div>
      </div>
      <div
        className={classNames(
          'align-items-center justify-content-between',
          isMobile ? 'd-flex' : 'd-none',
        )}
      >
        <div className="flex-grow-1 w-100">
          <Button onClick={handleMobileButtonClick} variant="outline">
            <MenuIcon />
          </Button>
        </div>
        <div className="d-flex justify-content-center flex-grow-1 w-100">
          <Logo />
        </div>
        <div className="d-flex flex-grow-1 justify-content-end w-100">
          {userMenu}
        </div>
      </div>
      {mobileOpen && (
        <FocusOn onClickOutside={() => setMobileOpen(false)} onEscapeKey={() => setMobileOpen(false)}>
          <NavLinks items={allLinks} className="flex-column" />
        </FocusOn>
      )}
    </nav>
  );
}
