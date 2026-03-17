import { LoaderFunctionArgs, redirect } from 'react-router';
import { getAuthenticatedUser, getLoginRedirectUrl } from '../auth';
import { getUrlByRouteRole } from './utils';

const loginRole = 'org.openedx.frontend.role.login';

export default function authenticatedLoader({ request }: LoaderFunctionArgs) {
  const authenticatedUser = getAuthenticatedUser();
  if (authenticatedUser !== null) {
    return null;
  }

  const requestUrl = new URL(request.url);
  const loginUrl = getUrlByRouteRole(loginRole);

  // Internal login route → SPA redirect with a relative ?next so the login
  // page can navigate() back without a full page refresh.
  if (loginUrl?.startsWith('/')) {
    return redirect(`${loginUrl}?next=${encodeURIComponent(requestUrl.pathname)}`);
  }

  // No login role found (or it's defined as an external route, which is not
  // supported). Use loginUrl from siteConfig and the full href for the return
  // path so the login service redirects back to the correct origin after
  // login.
  const fullLoginUrl = getLoginRedirectUrl(requestUrl.href);

  // Return a never-resolving promise so React Router keeps waiting (and does
  // not attempt to render the route) while the browser navigates away.
  global.location.assign(fullLoginUrl);
  return new Promise(() => { });
}
