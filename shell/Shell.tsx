import {
  AppProvider,
  Slot
} from '../runtime';
import { useActiveRouteRoleWatcher, useTrackColorSchemeChoice } from '../runtime/react/hooks';

import DefaultLayout from './DefaultLayout';

export default function Shell() {
  useActiveRouteRoleWatcher();
  useTrackColorSchemeChoice();

  return (
    <AppProvider>
      <Slot id="frontend.shell.layout.ui" layout={DefaultLayout} />
    </AppProvider>
  );
}
