import { init } from '@module-federation/runtime';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  subscribe
} from '../runtime';

import { SHELL_ID } from './data/constants';
import { getFederationRemotes, mergeInternalMessages } from './data/moduleUtils';
import messages from './i18n';
import createRouter from './router/createRouter';

subscribe(APP_READY, () => {
  init({
    name: SHELL_ID,
    remotes: getFederationRemotes(),
  });

  const router = createRouter();

  mergeInternalMessages();

  ReactDOM.render(
    <RouterProvider router={router} />,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<div>{error.message}</div>, document.getElementById('root'));
});

initialize({
  messages,
});
