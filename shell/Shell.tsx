import { Suspense } from 'react';
import { Outlet } from 'react-router';
import {
  AppProvider,
  PluginSlot
} from '../runtime';
import Footer from './footer';
import ActiveHeader from './header/ActiveHeader';

export default function Shell() {
  // TODO: Plugin Slots for header/footer should be per type, i.e., default, learning, and studio slots.
  return (
    <AppProvider>
      <PluginSlot id="org.openedx.frontend.shell.header.v1">
        <ActiveHeader />
      </PluginSlot>
      <Suspense fallback={<div>Loading</div>}>
        <Outlet />
      </Suspense>
      <PluginSlot id="org.openedx.frontend.shell.footer.v1">
        <Footer />
      </PluginSlot>
    </AppProvider>
  );
}
