import { useIntl } from '../../runtime';

import useResolvedHeaderConfig from './data/hooks';
import DesktopLayout from './desktop/DesktopLayout';
import messages from './Header.messages';
import HeaderContext from './HeaderContext';
import MobileLayout from './mobile/MobileLayout';

export default function Header() {
  const intl = useIntl();

  const resolvedHeaderConfig = useResolvedHeaderConfig();

  return (
    <HeaderContext.Provider value={resolvedHeaderConfig}>
      <nav className="py-2 px-3 border-bottom">
        <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
        <DesktopLayout />
        <MobileLayout />
      </nav>
    </HeaderContext.Provider>
  );
}
