import { Nav } from '@openedx/paragon';

import Slot from '../../../runtime/slots/Slot';

export default function PrimaryNavLinks() {
  return (
    <Nav className="flex-nowrap align-items-center">
      <Slot id="frontend.shell.header.primaryLinks.widget" />
    </Nav>
  );
}
