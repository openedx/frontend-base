import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '@openedx/frontend-base';

export default function AuthenticatedPage() {
  const { authenticatedUser, config } = useContext(AppContext);

  return (
    <main className="p-3">
      <h1>{config.SITE_NAME} authenticated page.</h1>
      <p>{authenticatedUser === null ? "You are not authenticated." : `Hi there, ${authenticatedUser.username}.`}</p>
      <p>Visit <Link to="/">public page</Link>.</p>
    </main>
  );
}
