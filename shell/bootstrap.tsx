import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  subscribe
} from '../runtime';
import { addAppMessages } from '../runtime/i18n';
import { initializeRemotes } from './federation/initializeRemotes';
import messages from './i18n';
import createRouter from './router/createRouter';

subscribe(APP_READY, async () => {
  initializeRemotes();


  const router = createRouter();

  addAppMessages();

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
