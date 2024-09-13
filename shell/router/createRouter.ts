import { createBrowserRouter } from 'react-router-dom';

import { getBasename } from '../../runtime/initialize';
import { SHELL_ID } from '../data/constants';
import Shell from '../Shell';
import createInternalRoutes from './createInternalRoutes';
import patchRoutesOnNavigation from './patchRoutesOnNavigation';

export default function createRouter() {
  return createBrowserRouter([
    {
      id: SHELL_ID,
      Component: Shell,
      children: createInternalRoutes(),
    }
  ], {
    basename: getBasename(),
    unstable_patchRoutesOnNavigation: patchRoutesOnNavigation,
  });
}
