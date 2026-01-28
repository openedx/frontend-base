import { Slot, useIntl } from '../../runtime';

import messages from '../Shell.messages';

export default function Header() {
  const intl = useIntl();

  return (
    <>
      <header className="border-bottom py-2">
        <nav className="py-2">
          <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
          <Slot id="org.openedx.frontend.slot.header.desktop.v1" />
          <Slot id="org.openedx.frontend.slot.header.mobile.v1" />
        </nav>
      </header>
      <Slot id="org.openedx.frontend.slot.header.courseNavigationBar.v1" />
    </>
  );
}
