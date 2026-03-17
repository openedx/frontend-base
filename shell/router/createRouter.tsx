import { createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { getBasename } from '../../runtime/initialize';
import ErrorPage from '../../runtime/react/ErrorPage';
import NotFoundPage from '../../runtime/react/NotFoundPage';
import Shell from '../Shell';

import getAppRoutes from './getAppRoutes';

function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return <ErrorPage />;
}

export default function createRouter() {
  return createBrowserRouter([
    {
      Component: Shell,
      errorElement: <RouteError />,
      children: getAppRoutes(),
    }
  ], {
    basename: getBasename(),
  });
}
