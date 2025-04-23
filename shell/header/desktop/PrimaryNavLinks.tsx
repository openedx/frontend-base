import { Nav } from '@openedx/paragon';
import { Slot } from '../../../runtime';

export default function PrimaryNavLinks() {
  return (
    <Nav className="flex-nowrap align-items-center">
      <Slot id="frontend.shell.header.primaryLinks.ui" />
    </Nav>
  );
}
