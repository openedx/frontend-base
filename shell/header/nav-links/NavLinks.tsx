import { Nav } from '@openedx/paragon';
import Slot from '../../../runtime/slots/Slot';

interface NavLinksProps {
  className?: string,
}

export default function NavLinks({ className }: NavLinksProps) {
  return (
    <Nav className={className}>
      <Slot id="frontend.shell.header.primaryLinks.widget" />
    </Nav>
  );
}
