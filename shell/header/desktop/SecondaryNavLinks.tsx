import { Nav } from '@openedx/paragon';
import { Slot } from '../../../runtime';

export default function SecondaryNavLinks() {
  return (
    <Nav className="flex-nowrap">
      <Slot id="org.openedx.frontend.slot.header.secondaryLinks.v1" />
    </Nav>
  );
}
