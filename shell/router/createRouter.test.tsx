import { createBrowserRouter } from 'react-router-dom';
import { getBasename } from '../../runtime/initialize';
import { SHELL_ID } from '../federation/constants';
import Shell from '../Shell';
import createRouter from './createRouter';
import getAppRoutes from './getAppRoutes';
import patchRoutesOnNavigation from './patchRoutesOnNavigation';

jest.mock('react-router-dom', () => ({
  createBrowserRouter: jest.fn(),
}));

jest.mock('../../runtime/initialize', () => ({
  getBasename: jest.fn(),
}));

jest.mock('../Shell', () => jest.fn());
jest.mock('./getAppRoutes', () => jest.fn());
jest.mock('./patchRoutesOnNavigation', () => jest.fn());

describe('createRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a router with the correct configuration', () => {
    const mockRoutes = [{ path: '/', element: <div>Home</div> }];
    const mockBasename = '/base';

    (getAppRoutes as jest.Mock).mockReturnValue(mockRoutes);
    (getBasename as jest.Mock).mockReturnValue(mockBasename);
    (createBrowserRouter as jest.Mock).mockReturnValue('fake router value');

    const result = createRouter();

    expect(getAppRoutes).toHaveBeenCalled();
    expect(getBasename).toHaveBeenCalled();
    expect(createBrowserRouter).toHaveBeenCalledWith(
      [
        {
          id: SHELL_ID,
          Component: Shell,
          children: mockRoutes,
        },
      ],
      {
        basename: mockBasename,
        unstable_patchRoutesOnNavigation: patchRoutesOnNavigation,
      }
    );

    // Just proving we actually return the router from createBrowserRouter.
    expect(result).toEqual('fake router value');
  });
});
