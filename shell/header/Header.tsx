import { useIntl } from '../../runtime';

import Slot from '../../runtime/slots/Slot';
import messages from '../Shell.messages';

export default function Header() {
  const intl = useIntl();

  return (
    <header className="border-bottom py-2">
      <nav className="py-2">
        <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
        <Slot id="frontend.shell.header.desktop.layout.ui" />
        <Slot id="frontend.shell.header.mobile.layout.ui" />
      </nav>
    </header>
  );
}
