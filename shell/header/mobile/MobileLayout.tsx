import { Button, Container, Nav } from '@openedx/paragon';
import { MenuIcon } from '@openedx/paragon/icons';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FocusOn } from 'react-focus-on';
import { useMediaQuery } from 'react-responsive';
import { Slot } from '../../../runtime';

export default function MobileLayout() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleMobileButtonClick = useCallback(() => {
    setMobileOpen((value) => !value);
  }, []);

  return (
    <>
      <Container
        fluid
        size="xl"
        className={classNames(
          'align-items-center justify-content-between',
          isMobile ? 'd-flex' : 'd-none',
        )}
      >
        <div className="d-flex flex-grow-1 flex-basis-0 justify-content-start align-items-center">
          <Button onClick={handleMobileButtonClick} variant="outline">
            <MenuIcon />
          </Button>
          <Slot id="org.openedx.frontend.slot.header.mobileLeft.v1" />
        </div>
        <div className="d-flex flex-grow-1 flex-basis-0 justify-content-center align-items-center">
          <Slot id="org.openedx.frontend.slot.header.mobileCenter.v1" />
        </div>
        <div className="d-flex flex-grow-1 flex-basis-0 justify-content-end align-items-center">
          <Slot id="org.openedx.frontend.slot.header.mobileRight.v1" />
        </div>
      </Container>
      {/* scrollLock would put data-scroll-locked on <body>, whose scrollbar compensation
          margin collapses the page on mobile. This menu is inline, so it doesn't need it. */}
      {mobileOpen && (
        <FocusOn
          scrollLock={false}
          onClickOutside={() => setMobileOpen(false)}
          onEscapeKey={() => setMobileOpen(false)}
        >
          <Container fluid size="xl">
            <Nav className="flex-column">
              <Slot id="org.openedx.frontend.slot.header.mobileMenuLinks.v1" />
            </Nav>
          </Container>
        </FocusOn>
      )}
    </>
  );
}
