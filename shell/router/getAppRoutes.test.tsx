import { RouteObject } from 'react-router';
import { getSiteConfig } from '../../runtime';
import getAppRoutes from './getAppRoutes';

jest.mock('../../runtime', () => ({
  getSiteConfig: jest.fn(),
}));

describe('getAppRoutes', () => {
  it('should return an empty array when no apps are configured', () => {
    (getSiteConfig as jest.Mock).mockReturnValue({ apps: [] });

    const routes = getAppRoutes();

    expect(routes).toEqual([]);
  });

  it('should flatten and return routes from configured apps', () => {
    const mockApps = [
      {
        routes: [
          { path: '/page1', element: <div>Page 1</div> },
          { path: '/page2', element: <div>Page 2</div> }
        ]
      },
      {
        routes: [
          { path: '/page3', element: <div>Page 3</div> }
        ]
      },
    ];

    (getSiteConfig as jest.Mock).mockReturnValue({ apps: mockApps });

    const routes = getAppRoutes();

    expect(routes).toEqual([
      { path: '/page1', element: <div>Page 1</div> },
      { path: '/page2', element: <div>Page 2</div> },
      { path: '/page3', element: <div>Page 3</div> }
    ]);
  });

  it('should ignore apps without routes', () => {
    const mockRoutes: RouteObject[] = [
      { path: '/page1', element: <div>Page 1</div> },
    ];
    const mockApps = [
      { routes: mockRoutes },
      { slots: [] },
    ];

    (getSiteConfig as jest.Mock).mockReturnValue({ apps: mockApps });

    const routes = getAppRoutes();

    expect(routes).toEqual(mockRoutes);
  });
});
