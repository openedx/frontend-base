import { Nav } from '@openedx/paragon';
import { Slot } from '../../../runtime';

export default function MobileNavLinks() {
  return (
    <Nav className="flex-column">
      <Slot id="org.openedx.frontend.slot.header.mobileMenuLinks.v1" />
    </Nav>
  );
}
