import { createBrowserRouter } from 'react-router-dom';

import { getBasename } from '../../runtime/initialize';
import Shell from '../Shell';

import getAppRoutes from './getAppRoutes';

export default function createRouter() {
  return createBrowserRouter([
    {
      Component: Shell,
      children: getAppRoutes(),
    }
  ], {
    basename: getBasename(),
  });
}
