import { Nav } from '@openedx/paragon';
import { Slot } from '../../../runtime';

export default function SecondaryNavLinks() {
  return (
    <Nav className="flex-nowrap">
      <Slot id="frontend.shell.header.secondaryLinks.ui" />
    </Nav>
  );
}
