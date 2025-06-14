import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  subscribe
} from '../runtime';
import { addAppConfigs } from '../runtime/config';
import { addAppMessages } from '../runtime/i18n';
import messages from './i18n';
import createRouter from './router/createRouter';

subscribe(APP_READY, async () => {
  const router = createRouter();

  addAppConfigs();
  addAppMessages();

  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <RouterProvider router={router} />,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(<div>{error.message}</div>);
});

initialize({
  messages,
});
