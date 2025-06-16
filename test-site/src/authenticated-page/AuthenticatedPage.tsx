import { Link } from 'react-router-dom';

import { useAuthenticatedUser, useSiteConfig } from '@openedx/frontend-base';
import { FormattedMessage } from 'react-intl';

export default function AuthenticatedPage() {
  const authenticatedUser = useAuthenticatedUser();
  const config = useSiteConfig();

  return (
    <main className="p-3">
      <h1>{config.siteName} authenticated page.</h1>
      <FormattedMessage id="authenticated.page.content" defaultMessage="This is a localized message.  Try it in French." description="This is a test message to prove localization works." />
      <p>{authenticatedUser === null ? 'You are not authenticated.' : `Hi there, ${authenticatedUser.username}.`}</p>
      <p>Visit <Link to="/">public page</Link>.</p>
    </main>
  );
}
