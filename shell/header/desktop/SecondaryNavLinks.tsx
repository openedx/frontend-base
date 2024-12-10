import { Nav } from '@openedx/paragon';

import Slot from '../../../runtime/slots/Slot';

export default function SecondaryNavLinks() {
  return (
    <Nav className="flex-nowrap">
      <Slot id="frontend.shell.header.secondaryLinks.widget" />
    </Nav>
  );
}
