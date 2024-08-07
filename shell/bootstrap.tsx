import { createElement } from 'react';
import ReactDOM from 'react-dom';

import {
  APP_INIT_ERROR, APP_READY,
  AppProvider,
  getConfig,
  initialize,
  subscribe,
} from '../runtime';

import Footer from './footer';
import Header from './header';

const messages = [];

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Header />
      {getConfig().app ? createElement(getConfig().app, {}) : null}
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
