import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '@openedx/frontend-base';

export default function AuthenticatedPage() {
  const { authenticatedUser, config } = useContext(AppContext);

  if (authenticatedUser === null) {
    return <></>;
  }

  return (
    <div>
      <h1>{config.SITE_NAME} authenticated page.</h1>
      <p>Hi there, {authenticatedUser.username}.</p>
      <p>Visit <Link to="/">public page</Link>.</p>
    </div>
  );
}
