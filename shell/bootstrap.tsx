import { init } from '@module-federation/runtime';
import ReactDOM from 'react-dom';

import { Container } from '@openedx/paragon';
import { Route, Routes } from 'react-router';
import {
  APP_INIT_ERROR, APP_READY,
  AppProvider,
  getConfig,
  initialize,
  subscribe
} from '../runtime';
import { ExternalAppConfig, FederatedAppConfig, InternalAppConfig } from '../types';
import FederatedComponent from './FederatedComponent';
import Footer from './footer';
import { DefaultHeader } from './header';

const messages = [];

function getFederatedApps() {
  const { apps } = getConfig();

  return apps.filter((app: InternalAppConfig | ExternalAppConfig | FederatedAppConfig) => 'remoteUrl' in app && 'appId' in app);
}

function getFederationRemotes(apps) {
  return apps.map(app => ({
    name: app.appId,
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
      <DefaultHeader />
      <Container className="m-2">
        <Routes>
          {internalApps.map((internalApp: InternalAppConfig) => {
            const AppComponent = internalApp.component;
            return (
              <Route
                key={`${internalApp.appId}-${internalApp.path}`}
                path={internalApp.path}
                element={<AppComponent />}
              />
            );
          })}
          {federatedApps.map((federatedApp: FederatedAppConfig) => (
            <Route
              key={`${federatedApp.appId}-${federatedApp.moduleId}`}
              path={federatedApp.path}
              element={<FederatedComponent federatedApp={federatedApp} />}
            />
          ))}
        </Routes>
      </Container>
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