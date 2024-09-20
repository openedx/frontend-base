import { ModalPopup, useToggle } from '@openedx/paragon';
import { useState } from 'react';
import HeaderBody from './HeaderBody';
import MobileMenu from './MobileMenu';

interface MobileHeaderProps {
  studioBaseUrl: string,
  logoutUrl: string,
  number?: string,
  org?: string,
  title?: string,
  logo?: string,
  logoAltText?: string,
  authenticatedUserAvatar?: string,
  username?: string,
  isAdmin?: boolean,
  mainMenuDropdowns?: Array<{
    id: string,
    buttonTitle: string,
    items: Array<{
      href: string,
      title: string,
    }>,
  }>,
  outlineLink?: string,
}

export default function MobileHeader({
  mainMenuDropdowns = [],
  isAdmin = false,
  ...props
}: MobileHeaderProps) {
  const [
    isOpen,
    open, // eslint-disable-line @typescript-eslint/no-unused-vars
    close,
    toggle
  ] = useToggle(false);
  const [target, setTarget] = useState(null);

  return (
    <>
      <HeaderBody
        {...props}
        isAdmin={isAdmin}
        isMobile
        setModalPopupTarget={setTarget}
        toggleModalPopup={toggle}
        isModalPopupOpen={isOpen}
      />
      <ModalPopup
        hasArrow
        placement="bottom"
        positionRef={target}
        isOpen={isOpen}
        onClose={close}
        onEscapeKey={close}
        className="mobile-menu-container"
      >
        <MobileMenu {...{ mainMenuDropdowns }} />
      </ModalPopup>
    </>
  );
}
