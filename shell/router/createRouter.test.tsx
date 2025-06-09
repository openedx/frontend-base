import { createBrowserRouter } from 'react-router-dom';
import { getBasename } from '../../runtime/initialize';
import Shell from '../Shell';
import createRouter from './createRouter';
import getAppRoutes from './getAppRoutes';

jest.mock('react-router-dom', () => ({
  createBrowserRouter: jest.fn(),
}));

jest.mock('../../runtime/initialize', () => ({
  getBasename: jest.fn(),
}));

jest.mock('../Shell', () => jest.fn());
jest.mock('./getAppRoutes', () => jest.fn());

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
          Component: Shell,
          children: mockRoutes,
        },
      ],
      {
        basename: mockBasename,
      }
    );

    // Just proving we actually return the router from createBrowserRouter.
    expect(result).toEqual('fake router value');
  });
});
