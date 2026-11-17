import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { getSiteConfig } from '../../runtime/config';
import { createIntl, getLocale, getMessages } from '../../runtime/i18n';
import ErrorPage from '../../runtime/react/ErrorPage';
import { usePageTitle } from '../../runtime/react/hooks';
import NotFoundPage from '../../runtime/react/NotFoundPage';
import messages from '../Shell.messages';

export default function RouteError() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  const { formatMessage } = createIntl({ locale: getLocale(), messages: getMessages() });
  usePageTitle(formatMessage(
    isNotFound ? messages.notFoundPageTitle : messages.errorPageTitle,
    { siteName: getSiteConfig().siteName },
  ));

  return isNotFound ? <NotFoundPage /> : <ErrorPage />;
}
