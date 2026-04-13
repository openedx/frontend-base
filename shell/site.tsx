import { lazy, StrictMode, Suspense } from 'react';
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
import messages from 'site.i18n';
import createRouter from './router/createRouter';

/*
 * Use a dynamic import guarded by process.env.NODE_ENV so that webpack
 * places the devtools in a separate async chunk that is only requested
 * in development. In production the ternary resolves to null and the
 * chunk is never loaded.
 */
const ReactQueryDevtools = process.env.NODE_ENV === 'development'
  ? lazy(() => import('@tanstack/react-query-devtools')
    .then((m) => ({ default: m.ReactQueryDevtools }))
    .catch(() => ({ default: () => null })))
  : null;

subscribe(SITE_READY, async () => {
  const queryClient = new QueryClient();
  const router = createRouter();

  addAppConfigs();

  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {ReactQueryDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
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
