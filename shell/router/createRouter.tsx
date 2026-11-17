import { createBrowserRouter } from 'react-router-dom';

import { getBasename } from '../../runtime/initialize';
import Shell from '../Shell';

import getAppRoutes from './getAppRoutes';
import RouteError from './RouteError';

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
