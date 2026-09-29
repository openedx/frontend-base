import { Button } from '@openedx/paragon';
import classNames from 'classnames';

import { getLinkProps, getUrlByRouteRole, useSiteConfig, useIntl } from '../../../runtime';
import { loginRole } from '../../constants';
import messages from '../../Shell.messages';

export default function LoginButton({ className, ...props }: { className?: string } & Record<string, unknown>) {
  const config = useSiteConfig();
  const intl = useIntl();

  // Prefer the route provided by an installed authentication app, falling back
  // to the login service configured for the site.
  const url = getUrlByRouteRole(loginRole) ?? config.loginUrl;

  return (
    <Button variant="primary" {...getLinkProps(url)} className={classNames('btn-login', className)} {...props}>
      {intl.formatMessage(messages['header.user.menu.login'])}
    </Button>
  );
}
