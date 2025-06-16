import {
  SiteProvider,
  Slot
} from '../runtime';
import { useActiveRouteRoleWatcher, useTrackColorSchemeChoice } from '../runtime/react/hooks';

import DefaultLayout from './DefaultLayout';

export default function Shell() {
  useActiveRouteRoleWatcher();
  useTrackColorSchemeChoice();

  return (
    <SiteProvider>
      <Slot id="org.openedx.frontend.slot.layout.main.v1" layout={DefaultLayout} />
    </SiteProvider>
  );
}
