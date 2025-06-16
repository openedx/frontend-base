import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import {
  SITE_INIT_ERROR,
  SITE_READY,
  initialize,
  subscribe
} from '../runtime';
import { addAppConfigs } from '../runtime/config';
import { addAppMessages } from '../runtime/i18n';
import messages from './i18n';
import createRouter from './router/createRouter';

subscribe(SITE_READY, async () => {
  const router = createRouter();

  addAppConfigs();
  addAppMessages();

  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <RouterProvider router={router} />,
  );
});

subscribe(SITE_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(<div>{error.message}</div>);
});

initialize({
  messages,
});
