import { Navigate, Outlet, useLocation } from 'react-router';
import { getLoginRedirectUrl } from '../auth';
import { getUrlByRouteRole } from '../routing';
import { useAuthenticatedUser } from './hooks';

const LOGIN_ROLE = 'org.openedx.frontend.role.login';

export default function AuthenticatedLayout() {
  const authenticatedUser = useAuthenticatedUser();
  const location = useLocation();
  if (authenticatedUser !== null) {
    return <Outlet />;
  }

  const loginUrl = getUrlByRouteRole(LOGIN_ROLE);

  // Internal login route → SPA navigation
  if (loginUrl?.startsWith('/')) {
    return <Navigate to={loginUrl} state={{ from: location }} replace />;
  }

  // External login (or no role found) → full page redirect with ?next= param
  global.location.assign(getLoginRedirectUrl(global.location.href));
  return null;
}
