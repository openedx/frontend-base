import { act, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import Shell from './Shell';

// Keep the shell's own providers and slots out of the way: these tests are only about the
// scroll position, and the routed page still renders through the outlet.
jest.mock('../runtime', () => {
  const { Outlet } = jest.requireActual('react-router-dom');
  return {
    SiteProvider: ({ children }) => children,
    Slot: () => <Outlet />,
  };
});

jest.mock('../runtime/react/hooks', () => ({
  useActiveRouteRoleWatcher: jest.fn(),
  useTrackColorSchemeChoice: jest.fn(),
}));

// The data router builds a fetch Request for every navigation, but jsdom does not provide one.
// None of these routes have loaders, so the URL and abort signal are all it needs.
class MockRequest {
  url: string;
  signal?: AbortSignal;

  constructor(url: string, init?: { signal?: AbortSignal }) {
    this.url = url;
    this.signal = init?.signal;
  }
}

function renderShell() {
  const router = createMemoryRouter([
    {
      Component: Shell,
      children: [
        { path: '/', element: <div>Home page</div> },
        { path: '/other', element: <div>Other page</div> },
      ],
    },
  ]);
  render(<RouterProvider router={router} />);
  return router;
}

describe('Shell scroll restoration', () => {
  let scrollTo: jest.SpyInstance;
  const originalRequest = globalThis.Request;

  beforeAll(() => {
    globalThis.Request = MockRequest as unknown as typeof Request;
  });

  afterAll(() => {
    globalThis.Request = originalRequest;
  });

  beforeEach(() => {
    // jsdom does not implement window.scrollTo.
    scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    scrollTo.mockRestore();
  });

  it('scrolls to the top on a new navigation', async () => {
    const router = renderShell();
    expect(screen.getByText('Home page')).toBeInTheDocument();
    scrollTo.mockClear();

    await act(() => router.navigate('/other'));

    expect(screen.getByText('Other page')).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('keeps the scroll position on a navigation with preventScrollReset', async () => {
    const router = renderShell();
    scrollTo.mockClear();

    await act(() => router.navigate('/?filter=all', { preventScrollReset: true }));

    expect(router.state.location.search).toEqual('?filter=all');
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
