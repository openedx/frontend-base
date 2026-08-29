import { Button } from '@openedx/paragon';

import { getUrlByRouteRole, useSiteConfig, useIntl } from '../../../runtime';
import { registerRole } from '../../constants';
import messages from '../../Shell.messages';
import { getLinkProps } from './utils';

export default function RegisterButton({ ...props }) {
  const config = useSiteConfig();
  const intl = useIntl();

  // Prefer the route provided by an installed authentication app, falling back
  // to the registration page served by the LMS.
  const url = getUrlByRouteRole(registerRole) ?? `${config.lmsBaseUrl}/register`;

  return (
    <Button variant="outline-primary" {...getLinkProps(url)} {...props}>
      {intl.formatMessage(messages['header.user.menu.register'])}
    </Button>
  );
}
