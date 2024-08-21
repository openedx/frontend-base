import { init } from '@module-federation/runtime';
import ReactDOM from 'react-dom';

import {
  APP_INIT_ERROR, APP_READY,
  AppProvider,
  getConfig,
  initialize,
  subscribe
} from '../runtime';

import { ExternalAppConfig, FederatedAppConfig, InternalAppConfig } from '../types';
import Footer from './footer';
import Header from './header';
import useFederatedComponent from './utils';
import { Suspense } from 'react';

const messages = [];

function getFederatedApps() {
  const { apps } = getConfig();

  return apps.filter((app: InternalAppConfig | ExternalAppConfig | FederatedAppConfig) => 'remoteUrl' in app && 'moduleId' in app);
}

function getFederationRemotes(apps) {
  return apps.map(app => ({
    name: app.moduleId,
    entry: app.remoteUrl
  }));
}

function getInternalApps(): Array<InternalAppConfig> {
  const { apps } = getConfig();

  return apps.filter((app: InternalAppConfig | ExternalAppConfig | FederatedAppConfig) => 'component' in app);
}

subscribe(APP_READY, () => {
  const federatedApps = getFederatedApps();
  const remotes = getFederationRemotes(federatedApps);

  init({
    name: 'shell',
    remotes,
  });

  const internalApps = getInternalApps();

  ReactDOM.render(
    <AppProvider wrapWithRouter>
      <Header />
      <div>Okay what?</div>
      {internalApps.map((internalApp: InternalAppConfig) => {
        const AppComponent = internalApp.component;
        return (
          <AppComponent key={internalApp.appId} />
        );
      })}
      {federatedApps.map((federatedApp: FederatedAppConfig) => {
        const { Component: FederatedComponent, errorLoading } = useFederatedComponent(
          federatedApp.remoteUrl,
          federatedApp.appId,
          federatedApp.moduleId
        );
        return (
          <Suspense fallback="Loading...">
            {errorLoading
              ? `Error loading module "${module}"`
              : FederatedComponent && <FederatedComponent />}
          </Suspense>
        );
      })}
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<div>{error.message}</div>, document.getElementById('root'));
});

initialize({
  messages,
  handlers: {
    // TODO: Remove this.
    auth: () => {}, // This MFE turns off auth so it can run independently of edx-platform.
  },
});
