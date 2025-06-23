import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  const queryClient = new QueryClient();
  const router = createRouter();

  addAppConfigs();
  addAppMessages();

  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />,
      </QueryClientProvider>
    </StrictMode>
  );
});

subscribe(SITE_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(<div>{error.message}</div>);
});

initialize({
  messages,
});
