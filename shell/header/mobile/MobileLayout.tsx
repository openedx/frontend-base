import { Button } from '@openedx/paragon';
import { MenuIcon } from '@openedx/paragon/icons';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FocusOn } from 'react-focus-on';
import { useMediaQuery } from 'react-responsive';
import { useAuthenticatedUser } from '../../../runtime';
import AnonymousMenu from '../anonymous-menu/AnonymousMenu';
import AuthenticatedMenu from '../authenticated-menu';
import Logo from '../Logo';
import MobileNavLinks from './MobileNavLinks';

export default function MobileLayout() {
  const authenticatedUser = useAuthenticatedUser();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleMobileButtonClick = useCallback(() => {
    setMobileOpen((value) => !value);
  }, []);

  return (
    <>
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
          {authenticatedUser ? (
            <AuthenticatedMenu />
          ) : (
            <AnonymousMenu />
          )}
        </div>
      </div>
      {mobileOpen && (
        <FocusOn onClickOutside={() => setMobileOpen(false)} onEscapeKey={() => setMobileOpen(false)}>
          <MobileNavLinks />
        </FocusOn>
      )}
    </>
  );
}
