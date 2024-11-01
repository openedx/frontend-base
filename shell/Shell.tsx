import { Suspense } from 'react';
import { Outlet } from 'react-router';
import {
  AppProvider,
  PluginSlot
} from '../runtime';
import Footer from './footer/Footer';
import Header from './header/Header';

export default function Shell() {
  return (
    <AppProvider>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-0 flex-shrink-0">
          <PluginSlot id="org.openedx.frontend.shell.header.v1">
            <Header />
          </PluginSlot>
        </div>
        <div id="main-content" className="flex-grow-1">
          <Suspense fallback={<div>Loading</div>}>
            <Outlet />
          </Suspense>
        </div>
        <div className="flex-grow-0 flex-shrink-0">
          <PluginSlot id="org.openedx.frontend.shell.footer.v1">
            <Footer />
          </PluginSlot>
        </div>
      </div>
    </AppProvider>
  );
}
