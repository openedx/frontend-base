import { useIntl } from '../../runtime';

import messages from '../Shell.messages';
import useResolvedHeaderConfig from './data/hooks';
import DesktopLayout from './desktop/DesktopLayout';
import HeaderContext from './HeaderContext';
import MobileLayout from './mobile/MobileLayout';

export default function Header() {
  const intl = useIntl();

  const resolvedHeaderConfig = useResolvedHeaderConfig();

  return (
    <HeaderContext.Provider value={resolvedHeaderConfig}>
      <header className="border-bottom py-2">
        <nav className="py-2">
          <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
          <DesktopLayout />
          <MobileLayout />
        </nav>
      </header>
    </HeaderContext.Provider>
  );
}
