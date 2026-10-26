import { Slot } from '../../runtime';

import SkipLink from './SkipLink';

export default function Header() {
  return (
    <>
      <header className="border-bottom">
        <nav>
          <SkipLink />
          <Slot id="org.openedx.frontend.slot.header.desktop.v1" />
          <Slot id="org.openedx.frontend.slot.header.mobile.v1" />
        </nav>
      </header>
      <Slot id="org.openedx.frontend.slot.header.masqueradeBar.v1" />
      <Slot id="org.openedx.frontend.slot.header.courseNavigationBar.v1" />
    </>
  );
}
