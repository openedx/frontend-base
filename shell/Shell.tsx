import { Suspense } from 'react';
import { Outlet } from 'react-router';
import {
  AppProvider,
  PluginSlot
} from '../runtime';
import ActiveFooter from './footer';

export default function Shell() {
  // TODO: Plugin Slots for header/footer should be per type, i.e., default, learning, and studio slots.
  return (
    <AppProvider>
      <PluginSlot id="org.openedx.frontend.shell.header.v1">
      </PluginSlot>
      <Suspense fallback={<div>Loading</div>}>
        <Outlet />
      </Suspense>
      <PluginSlot id="org.openedx.frontend.shell.footer.v1">
        <ActiveFooter />
      </PluginSlot>
    </AppProvider>
  );
}
