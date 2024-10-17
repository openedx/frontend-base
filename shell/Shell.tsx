import { Suspense } from 'react';
import { Outlet } from 'react-router';
import {
  AppProvider,
  PluginSlot
} from '../runtime';
import ActiveFooter from './footer';
import Header from './header/Header';

export default function Shell() {
  return (
    <AppProvider>
      <PluginSlot id="org.openedx.frontend.shell.header.v1">
        <Header />
      </PluginSlot>
      <div id="main-content" />
      <Suspense fallback={<div>Loading</div>}>
        <Outlet />
      </Suspense>
      <PluginSlot id="org.openedx.frontend.shell.footer.v1">
        <ActiveFooter />
      </PluginSlot>
    </AppProvider>
  );
}
