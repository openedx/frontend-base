import { Nav } from '@openedx/paragon';
import { Slot } from '../../../runtime';

export default function PrimaryNavLinks() {
  return (
    <Nav className="flex-nowrap align-items-center">
      <Slot id="org.openedx.frontend.slot.header.primaryLinks.v1" />
    </Nav>
  );
}
