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
      <Slot id="org.openedx.frontend.slot.layout.main.v1" layout={DefaultLayout} />
    </AppProvider>
  );
}
