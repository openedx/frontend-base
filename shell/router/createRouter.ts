import { createBrowserRouter } from 'react-router-dom';

import { getBasename } from '../../runtime/initialize';
import { SHELL_ID } from '../federation/constants';
import Shell from '../Shell';

import getAppRoutes from './getAppRoutes';
import patchRoutesOnNavigation from './patchRoutesOnNavigation';

export default function createRouter() {
  return createBrowserRouter([
    {
      id: SHELL_ID,
      Component: Shell,
      children: getAppRoutes(),
    }
  ], {
    basename: getBasename(),
    unstable_patchRoutesOnNavigation: patchRoutesOnNavigation,
  });
}
