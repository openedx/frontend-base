import { ScrollRestoration } from 'react-router-dom';

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
      {/* Start each navigation at the top of the page, and restore the position on back/forward. */}
      <ScrollRestoration />
      <Slot id="org.openedx.frontend.slot.layout.main.v1" layout={DefaultLayout} />
    </SiteProvider>
  );
}
