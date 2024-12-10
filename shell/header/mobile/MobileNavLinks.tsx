import { Nav } from '@openedx/paragon';
import Slot from '../../../runtime/slots/Slot';

export default function MobileNavLinks() {
  return (
    <Nav className="flex-column">
      <Slot id="frontend.shell.header.mobile.menuLinks.widget" />
    </Nav>
  );
}
