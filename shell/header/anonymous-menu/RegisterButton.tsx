import { Button } from '@openedx/paragon';
import classNames from 'classnames';

import { getLinkProps, getUrlByRouteRole, useSiteConfig, useIntl } from '../../../runtime';
import { registerRole } from '../../constants';
import messages from '../../Shell.messages';

export default function RegisterButton({ className, ...props }: { className?: string } & Record<string, unknown>) {
  const config = useSiteConfig();
  const intl = useIntl();

  // Prefer the route provided by an installed authentication app, falling back
  // to the registration page served by the LMS.
  const url = getUrlByRouteRole(registerRole) ?? `${config.lmsBaseUrl}/register`;

  return (
    <Button variant="primary" {...getLinkProps(url)} className={classNames('btn-register', className)} {...props}>
      {intl.formatMessage(messages['header.user.menu.register'])}
    </Button>
  );
}
