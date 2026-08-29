import { Button } from '@openedx/paragon';
import { getUrlByRouteRole, useSiteConfig, useIntl } from '../../../runtime';
import { loginRole } from '../../constants';
import messages from '../../Shell.messages';
import { getLinkProps } from './utils';

export default function LoginButton({ ...props }) {
  const config = useSiteConfig();
  const intl = useIntl();

  // Prefer the route provided by an installed authentication app, falling back
  // to the login service configured for the site.
  const url = getUrlByRouteRole(loginRole) ?? config.loginUrl;

  return (
    <Button variant="link" {...getLinkProps(url)} {...props}>
      {intl.formatMessage(messages['header.user.menu.login'])}
    </Button>
  );
}
