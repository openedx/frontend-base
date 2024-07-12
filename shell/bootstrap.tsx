import { init } from '@module-federation/runtime';
import ReactDOM from 'react-dom';
import {
  APP_INIT_ERROR, APP_READY,
  AppProvider,
  initialize,
  subscribe,
} from '../runtime';

import './index.scss';

const messages = [];

init({
  name: 'host',
  remotes: [
    {
      name: 'guest',
      entry: 'http://localhost:8081/remoteEntry.js',
    },
  ],
});

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <div>Hi there.</div>
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
    auth: () => { }, // This MFE turns off auth so it can run independently of edx-platform.
  },
});
