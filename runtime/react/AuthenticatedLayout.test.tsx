import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthenticatedLayout from './AuthenticatedLayout';
import { useAuthenticatedUser } from './hooks';
import { getUrlByRouteRole } from '../routing';
import { getLoginRedirectUrl } from '../auth';

jest.mock('./hooks');
jest.mock('../routing');
jest.mock('../auth');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  Navigate: ({ to, state }: { to: string, state?: any }) => (
    <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)}>
      Navigate to {to}
    </div>
  ),
}));

const mockUseAuthenticatedUser = useAuthenticatedUser as jest.MockedFunction<typeof useAuthenticatedUser>;
const mockGetUrlByRouteRole = getUrlByRouteRole as jest.MockedFunction<typeof getUrlByRouteRole>;
const mockGetLoginRedirectUrl = getLoginRedirectUrl as jest.MockedFunction<typeof getLoginRedirectUrl>;

const mockLocationAssign = jest.fn();

describe('AuthenticatedLayout', () => {
  let originalLocation: Location;

  beforeAll(() => {
    // Save the original location
    originalLocation = global.location;
    // Override global.location for tests
    Object.defineProperty(global, 'location', {
      value: {
        href: 'https://example.com/current-page',
        assign: mockLocationAssign,
      },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original location
    Object.defineProperty(global, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Outlet when user is authenticated', () => {
    mockUseAuthenticatedUser.mockReturnValue({
      administrator: false,
      email: 'test@example.com',
      name: 'Test User',
      roles: ['student'],
      userId: 123,
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg'
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(container.querySelector('[data-testid="outlet"]')).toBeInTheDocument();
    expect(mockLocationAssign).not.toHaveBeenCalled();
    expect(mockGetUrlByRouteRole).not.toHaveBeenCalled();
  });

  it('calls location.assign with external login URL when user is not authenticated and login role is external', () => {
    mockUseAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue('https://auth.example.com/login');
    mockGetLoginRedirectUrl.mockReturnValue('https://auth.example.com/login?next=https%3A//example.com/current-page');

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(mockGetUrlByRouteRole).toHaveBeenCalledWith('org.openedx.frontend.role.login');
    expect(mockGetLoginRedirectUrl).toHaveBeenCalledWith('https://example.com/current-page');
    expect(mockLocationAssign).toHaveBeenCalledWith('https://auth.example.com/login?next=https%3A//example.com/current-page');
  });

  it('renders Navigate component for internal login when user is not authenticated and login role is internal', () => {
    mockUseAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue('/login');

    const { container } = render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );

    expect(mockGetUrlByRouteRole).toHaveBeenCalledWith('org.openedx.frontend.role.login');
    expect(mockLocationAssign).not.toHaveBeenCalled();
    // Verify Navigate component is rendered with correct props
    const navigateElement = container.querySelector('[data-testid="navigate"]');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', '/login');
    expect(navigateElement).toHaveTextContent('Navigate to /login');
  });

  it('falls back to external redirect when user is not authenticated and no login role is found', () => {
    mockUseAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue(null);
    mockGetLoginRedirectUrl.mockReturnValue('https://auth.example.com/login?next=https%3A//example.com/current-page');

    render(
      <MemoryRouter>
        <AuthenticatedLayout />
      </MemoryRouter>
    );
    expect(mockGetUrlByRouteRole).toHaveBeenCalledWith('org.openedx.frontend.role.login');
    expect(mockGetLoginRedirectUrl).toHaveBeenCalledWith('https://example.com/current-page');
    expect(mockLocationAssign).toHaveBeenCalledWith('https://auth.example.com/login?next=https%3A//example.com/current-page');
  });

  it('passes location state when navigating to internal login', () => {
    mockUseAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue('/login');
    const currentPath = '/protected-page';

    const { container } = render(
      <MemoryRouter initialEntries={[currentPath]}>
        <AuthenticatedLayout />
      </MemoryRouter>
    );
    expect(mockGetUrlByRouteRole).toHaveBeenCalledWith('org.openedx.frontend.role.login');
    expect(mockLocationAssign).not.toHaveBeenCalled();
    // Verify Navigate component is rendered with correct props and state
    const navigateElement = container.querySelector('[data-testid="navigate"]');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', '/login');
    // Verify the state contains the 'from' location
    const stateAttr = navigateElement?.getAttribute('data-state');
    const state = JSON.parse(stateAttr ?? '{}');
    expect(state.from).toEqual(expect.objectContaining({ pathname: currentPath }));
  });
});
